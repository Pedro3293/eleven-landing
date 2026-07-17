'use client';

/** Botón flotante + panel del entrenador IA, accesible desde toda la app. */
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Sheet } from '@/components/ui/Sheet';
import { ChatPanel } from './ChatPanel';

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // El player lleva su propio chat embebido con contexto de sesión
  if (pathname.startsWith('/session/') || pathname === '/') return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir chat con tu entrenador"
        className="fixed bottom-5 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-ink shadow-2xl active:brightness-90"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Tu entrenador">
        <div className="h-[60dvh]">
          <ChatPanel
            context="global"
            suggestions={[
              '¿Qué toca en mi próxima sesión?',
              'Explícame la técnica del peso muerto',
              'Solo tengo mancuernas esta semana',
            ]}
          />
        </div>
      </Sheet>
    </>
  );
}
