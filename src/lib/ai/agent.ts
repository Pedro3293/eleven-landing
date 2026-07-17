/**
 * Agent loop del entrenador IA (Claude API con tool-use, solo servidor).
 * Sin ANTHROPIC_API_KEY el chat funciona en modo degradado (D-8): el endpoint
 * responde con aviso y la UI ofrece acciones rápidas no-IA.
 */
import Anthropic from '@anthropic-ai/sdk';
import { config } from '@/lib/config';
import { prisma } from '@/lib/db';
import { SYSTEM_PROMPT } from './system-prompt';
import { TOOL_DEFINITIONS, executeTool } from './tools';

const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-5';
const MAX_TURNS = 6;
const HISTORY_LIMIT = 30;

export interface AgentReply {
  text: string;
  toolsUsed: string[];
  degraded: boolean;
}

export async function runAgent(userId: string, threadId: string, userMessage: string): Promise<AgentReply> {
  await prisma.chatMessage.create({ data: { threadId, role: 'user', content: userMessage } });

  if (!config.aiEnabled) {
    const text =
      'El entrenador IA no está configurado en este servidor (falta ANTHROPIC_API_KEY). ' +
      'Puedes seguir entrenando con normalidad: sustituir ejercicios, ajustar series y descansos desde el propio player. ' +
      'Cuando la clave esté configurada, aquí tendrás respuestas y cambios de plan al momento.';
    await prisma.chatMessage.create({ data: { threadId, role: 'assistant', content: text } });
    return { text, toolsUsed: [], degraded: true };
  }

  const client = new Anthropic({ apiKey: config.anthropicApiKey });

  // Reconstruye historial persistido (solo texto: los tool-use viven dentro de cada turno)
  const history = await prisma.chatMessage.findMany({
    where: { threadId, role: { in: ['user', 'assistant'] } },
    orderBy: { createdAt: 'asc' },
    take: HISTORY_LIMIT,
  });
  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const toolsUsed: string[] = [];
  let finalText = '';

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOL_DEFINITIONS,
      messages,
    });

    const toolUses = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use');
    const textBlocks = response.content.filter((b): b is Anthropic.TextBlock => b.type === 'text');
    finalText = textBlocks.map((b) => b.text).join('\n').trim() || finalText;

    if (toolUses.length === 0 || response.stop_reason !== 'tool_use') break;

    messages.push({ role: 'assistant', content: response.content });
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const tu of toolUses) {
      toolsUsed.push(tu.name);
      let result: string;
      try {
        result = await executeTool(userId, tu.name, tu.input as Record<string, unknown>);
      } catch (err) {
        result = JSON.stringify({ error: err instanceof Error ? err.message : 'Error ejecutando la acción' });
      }
      results.push({ type: 'tool_result', tool_use_id: tu.id, content: result });
    }
    messages.push({ role: 'user', content: results });
  }

  if (!finalText) finalText = 'No he podido completar la petición. ¿Puedes reformularla?';

  await prisma.chatMessage.create({
    data: {
      threadId,
      role: 'assistant',
      content: finalText,
      toolCalls: toolsUsed.length ? JSON.stringify(toolsUsed) : null,
    },
  });

  return { text: finalText, toolsUsed, degraded: false };
}

export async function getOrCreateThread(userId: string, context: string) {
  const existing = await prisma.chatThread.findFirst({ where: { userId, context } });
  if (existing) return existing;
  return prisma.chatThread.create({ data: { userId, context } });
}
