'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function StartSessionButton({ sessionId, label }: { sessionId: string | null; label: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setLoading(true);
    setError(null);
    try {
      let id = sessionId;
      if (!id) {
        const res = await fetch('/api/sessions/next', { method: 'POST' });
        if (!res.ok) throw new Error();
        id = ((await res.json()) as { sessionId: string }).sessionId;
      }
      router.push(`/session/${id}`);
    } catch {
      setError('No se ha podido preparar la sesión. Inténtalo de nuevo.');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button size="lg" loading={loading} onClick={() => void go()}>
        {label}
      </Button>
      {error && <p className="text-sm text-danger" role="alert">{error}</p>}
    </div>
  );
}
