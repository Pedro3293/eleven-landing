import type { Metadata, Viewport } from 'next';
import { FloatingChat } from '@/components/chat/FloatingChat';
import { ServiceWorkerRegistrar } from '@/components/pwa/ServiceWorkerRegistrar';
import './globals.css';

export const metadata: Metadata = {
  title: 'FORGE — Entrenamiento adaptativo',
  description:
    'La app de entrenamiento que se adapta a ti en tiempo real: sesiones generadas por IA, player con timers y progreso multimodal.',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#090A0C',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-bg text-ink antialiased">
        {children}
        <FloatingChat />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
