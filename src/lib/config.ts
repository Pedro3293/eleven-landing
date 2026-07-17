import { join } from 'node:path';

export type MediaSource = 'dev-dataset' | 'own-assets' | 'licensed-api' | 'ai-generated';

export const config = {
  /** Fuente de medios de ejercicios. Gate 0: 'dev-dataset' es SOLO para desarrollo. */
  mediaSource: (process.env.MEDIA_SOURCE ?? 'dev-dataset') as MediaSource,
  /** Raíz en disco de los medios según la fuente activa. */
  get mediaRoot(): string {
    switch (this.mediaSource) {
      case 'dev-dataset':
        return join(process.cwd(), 'vendor', 'exercises-dataset');
      default:
        return join(process.cwd(), 'storage', 'media');
    }
  },
  /** Directorio de storage privado (fotos de progreso). Nunca dentro de /public. */
  privateStorageRoot: join(process.cwd(), 'storage', 'private'),
  authSecret: process.env.AUTH_SECRET ?? 'dev-secret-cambiar-en-produccion',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  get aiEnabled(): boolean {
    return Boolean(this.anthropicApiKey);
  },
};
