'use client';

/**
 * Cola offline del player: los POST que fallan por red se guardan en localStorage
 * y se reintentan al volver la conexión (o al abrir la app). Orden FIFO preservado.
 */

const KEY = 'forge-offline-queue';

interface QueuedRequest {
  url: string;
  body: string;
  ts: number;
}

function read(): QueuedRequest[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as QueuedRequest[];
  } catch {
    return [];
  }
}

function write(queue: QueuedRequest[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(queue.slice(-200)));
  } catch {
    // storage lleno: se pierde lo más antiguo de forma silenciosa
  }
}

/** POST JSON con encolado automático si no hay red. Devuelve true si llegó al servidor. */
export async function postWithQueue(url: string, payload: unknown): Promise<boolean> {
  const body = JSON.stringify(payload);
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    if (res.ok) return true;
    // errores 4xx no se reencolan (petición inválida); 5xx sí
    if (res.status < 500) return false;
    throw new Error(String(res.status));
  } catch {
    write([...read(), { url, body, ts: Date.now() }]);
    return false;
  }
}

/** Reintenta la cola completa. Se detiene en el primer fallo de red para preservar el orden. */
export async function flushQueue(): Promise<void> {
  let queue = read();
  while (queue.length > 0) {
    const item = queue[0];
    try {
      const res = await fetch(item.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: item.body });
      if (!res.ok && res.status >= 500) throw new Error(String(res.status));
    } catch {
      write(queue);
      return;
    }
    queue = queue.slice(1);
  }
  write(queue);
}

export function pendingCount(): number {
  return read().length;
}

/** Engancha el vaciado automático al volver la red. Devuelve un cleanup. */
export function attachAutoFlush(onFlushed?: () => void): () => void {
  const handler = () => {
    void flushQueue().then(() => onFlushed?.());
  };
  window.addEventListener('online', handler);
  handler();
  return () => window.removeEventListener('online', handler);
}
