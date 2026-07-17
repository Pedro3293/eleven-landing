'use client';

/** Galería de fotos de progreso + comparador lado a lado por fechas. */
import { useEffect, useState } from 'react';
import { Images } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Sheet } from '@/components/ui/Sheet';

interface Photo {
  id: string;
  url: string;
  takenAt: string;
  pose: string | null;
}

export function PhotoSection() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState<Photo[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    void fetch('/api/photos')
      .then((r) => r.json())
      .then((d: { photos: Photo[] }) => setPhotos(d.photos ?? []))
      .catch(() => undefined);
  }, []);

  function toggle(photo: Photo) {
    setSelected((prev) => {
      const exists = prev.some((p) => p.id === photo.id);
      if (exists) return prev.filter((p) => p.id !== photo.id);
      const next = [...prev, photo].slice(-2);
      if (next.length === 2) setCompareOpen(true);
      return next;
    });
  }

  if (photos.length === 0) {
    return (
      <section aria-label="Fotos de progreso">
        <h2 className="mb-2 text-sm font-medium text-muted">Fotos de progreso</h2>
        <Card className="flex items-center gap-3 text-sm text-muted">
          <Images className="h-5 w-5 shrink-0" aria-hidden />
          Sube una foto en tu check-in semanal para empezar a comparar tu evolución.
        </Card>
      </section>
    );
  }

  return (
    <section aria-label="Fotos de progreso">
      <h2 className="mb-2 text-sm font-medium text-muted">
        Fotos de progreso · toca dos para comparar
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((p) => {
          const isSel = selected.some((s) => s.id === p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p)}
              aria-pressed={isSel}
              className={`relative aspect-[3/4] overflow-hidden rounded-control border ${isSel ? 'border-accent' : 'border-line'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={`Foto del ${fmt(p.takenAt)}`} className="h-full w-full object-cover" loading="lazy" />
              <span className="absolute bottom-0 inset-x-0 bg-black/60 px-1 py-0.5 text-center text-[10px] text-white">
                {fmt(p.takenAt)}
              </span>
            </button>
          );
        })}
      </div>

      <Sheet open={compareOpen} onClose={() => { setCompareOpen(false); setSelected([]); }} title="Comparador">
        {selected.length === 2 && (
          <div className="grid grid-cols-2 gap-2">
            {[...selected].sort((a, b) => a.takenAt.localeCompare(b.takenAt)).map((p) => (
              <figure key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={`Foto del ${fmt(p.takenAt)}`} className="aspect-[3/4] w-full rounded-control object-cover" />
                <figcaption className="mt-1 text-center text-xs text-muted">{fmt(p.takenAt)}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </Sheet>
    </section>
  );
}

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' });
}
