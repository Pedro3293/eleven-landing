import type { MethodologyConfig } from '../types';
import { fullbodyLineal } from './fullbody-lineal';
import { ppl } from './ppl';
import { upperLower } from './upper-lower';
import { hipertrofiaVolumen } from './hipertrofia-volumen';
import { calistenia } from './calistenia';

/** Catálogo v1. Añadir una metodología = añadir una config aquí. */
export const METHODOLOGIES: MethodologyConfig[] = [
  fullbodyLineal,
  ppl,
  upperLower,
  hipertrofiaVolumen,
  calistenia,
];

export function getMethodology(id: string): MethodologyConfig | undefined {
  return METHODOLOGIES.find((m) => m.id === id);
}
