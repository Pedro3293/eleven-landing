/** RNG determinista con semilla de texto (mulberry32 + hash FNV-1a). */

function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export interface Rng {
  /** [0, 1) */
  next(): number;
  /** entero en [0, n) */
  int(n: number): number;
  /** elige un elemento; undefined si el array está vacío */
  pick<T>(arr: T[]): T | undefined;
}

export function createRng(seed: string): Rng {
  let a = fnv1a(seed) || 1;
  const next = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (n: number) => Math.floor(next() * n),
    pick: <T>(arr: T[]) => (arr.length === 0 ? undefined : arr[Math.floor(next() * arr.length)]),
  };
}
