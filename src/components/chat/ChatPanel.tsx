'use client';

/** Panel de chat con el entrenador IA. Reutilizable: global (flotante) y embebido en player. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Send, ShieldAlert } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatPanelProps {
  context: string;
  /** Se llama cuando la IA ejecuta cambios (para refrescar la sesión visible). */
  onToolsUsed?: (tools: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export function ChatPanel({ context, onToolsUsed, placeholder = 'Pregunta o pide un cambio…', suggestions = [] }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/chat?context=${encodeURIComponent(context)}`)
      .then((r) => r.json())
      .then((d: { messages: Message[] }) => {
        if (!cancelled) setMessages(d.messages ?? []);
      })
      .catch(() => undefined)
      .finally(() => !cancelled && setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, [context]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  const send = useCallback(
    async (text: string) => {
      const message = text.trim();
      if (!message || sending) return;
      setInput('');
      setSending(true);
      setMessages((m) => [...m, { id: `u-${Date.now()}`, role: 'user', content: message }]);
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, context }),
        });
        const data = (await res.json()) as { text?: string; toolsUsed?: string[]; error?: string };
        setMessages((m) => [
          ...m,
          { id: `a-${Date.now()}`, role: 'assistant', content: data.text ?? data.error ?? 'Error inesperado.' },
        ]);
        if (data.toolsUsed?.length) onToolsUsed?.(data.toolsUsed);
      } catch {
        setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', content: 'Sin conexión. Inténtalo de nuevo.' }]);
      } finally {
        setSending(false);
      }
    },
    [context, sending, onToolsUsed],
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <p className="mb-2 flex items-start gap-1.5 rounded-control bg-surface-2/60 px-2.5 py-1.5 text-[11px] leading-snug text-muted">
        <ShieldAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
        El entrenador IA no diagnostica ni sustituye a un profesional sanitario.
      </p>

      <div className="flex-1 space-y-3 overflow-y-auto pb-2" role="log" aria-live="polite">
        {loaded && messages.length === 0 && (
          <div className="flex flex-col gap-2 py-4">
            <p className="text-center text-sm text-muted">
              Pregunta lo que quieras: técnica, dudas del plan o cambios de la sesión.
            </p>
            {suggestions.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="rounded-full border border-line bg-surface-2 px-3 py-2 text-xs text-ink active:border-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'ml-auto rounded-br-md bg-accent text-accent-ink'
                : 'mr-auto rounded-bl-md border border-line bg-surface-2 text-ink'
            }`}
          >
            {m.content}
          </div>
        ))}
        {sending && (
          <div className="mr-auto animate-pulse rounded-2xl rounded-bl-md border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-muted">
            Pensando…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="mt-2 flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void send(input);
            }
          }}
          rows={1}
          placeholder={placeholder}
          aria-label="Mensaje para el entrenador"
          className="max-h-28 min-h-[44px] flex-1 resize-none rounded-control border border-line bg-surface-2 px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          aria-label="Enviar"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-accent text-accent-ink disabled:opacity-40"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
