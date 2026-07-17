/**
 * Base de conocimiento del entrenador (D-12). Búsqueda léxica determinista:
 * normaliza tildes, puntúa keywords > título > cuerpo. Sin dependencias ni red,
 * así alimenta tanto las tools del agente como el modo degradado del chat.
 */
import type { KnowledgeCategory, KnowledgeEntry } from './types';
import { CIENCIA } from './ciencia';
import { METODOLOGIA } from './metodologia';
import { ACONDICIONAMIENTO } from './acondicionamiento';
import { SALUD } from './salud';

export type { KnowledgeCategory, KnowledgeEntry } from './types';

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  ...CIENCIA,
  ...METODOLOGIA,
  ...ACONDICIONAMIENTO,
  ...SALUD,
];

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOPWORDS = new Set([
  'de', 'la', 'el', 'los', 'las', 'un', 'una', 'y', 'o', 'que', 'con', 'para', 'por', 'en', 'a',
  'me', 'mi', 'tengo', 'como', 'cual', 'es', 'del', 'al', 'se', 'si', 'no', 'mas', 'muy', 'hay',
  'puedo', 'debo', 'hacer', 'sobre', 'entre', 'este', 'esta', 'entrenar', 'entrenamiento', 'ejercicio',
]);

interface Scored {
  entry: KnowledgeEntry;
  score: number;
}

export function searchKnowledge(
  query: string,
  opts: { category?: KnowledgeCategory; limit?: number } = {},
): KnowledgeEntry[] {
  const terms = normalize(query)
    .split(' ')
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
  if (terms.length === 0) return [];

  const pool = opts.category ? KNOWLEDGE_BASE.filter((e) => e.category === opts.category) : KNOWLEDGE_BASE;

  const scored: Scored[] = pool.map((entry) => {
    const keywords = entry.keywords.map(normalize);
    const title = normalize(entry.title);
    const content = normalize(entry.content);
    let score = 0;
    for (const term of terms) {
      if (keywords.some((k) => k === term)) score += 10;
      else if (keywords.some((k) => k.includes(term) || term.includes(k))) score += 6;
      if (title.includes(term)) score += 4;
      else if (content.includes(term)) score += 1;
    }
    // frase completa dentro de una keyword compuesta ("diabetes tipo 1")
    const q = normalize(query);
    if (keywords.some((k) => k.length > 4 && q.includes(k))) score += 8;
    return { entry, score };
  });

  return scored
    .filter((s) => s.score >= 6)
    .sort((a, b) => b.score - a.score)
    .slice(0, opts.limit ?? 3)
    .map((s) => s.entry);
}

/** Entrada de salud aplicable a una condición declarada del perfil (clave exacta). */
export function getConditionEntry(conditionKey: string): KnowledgeEntry | undefined {
  return KNOWLEDGE_BASE.find((e) => e.category === 'salud' && e.id === conditionKey);
}
