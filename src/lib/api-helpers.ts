import { NextResponse } from 'next/server';
import { ZodError, type ZodTypeAny, type z } from 'zod';
import { DomainError } from '@/lib/services/plan-service';

/** Envuelve un handler: errores de dominio → status apropiado; el resto → 500 sin filtrar detalles. */
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>,
): (...args: T) => Promise<Response> {
  return async (...args: T) => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof DomainError) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      if (err instanceof ZodError) {
        return NextResponse.json(
          { error: 'Datos no válidos', issues: err.issues.map((i) => `${i.path.join('.')}: ${i.message}`) },
          { status: 400 },
        );
      }
      console.error('[api]', err instanceof Error ? err.message : err);
      return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
  };
}

export async function parseBody<T extends ZodTypeAny>(req: Request, schema: T): Promise<z.infer<T>> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    json = {};
  }
  return schema.parse(json);
}
