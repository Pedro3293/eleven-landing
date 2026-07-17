'use client';

/** Check-in según la cadencia de la metodología: formulario + foto opcional. */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarCheck, Camera } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Sheet } from '@/components/ui/Sheet';
import { INJURY_ZONE_LABELS, INJURY_ZONES } from '@/lib/repository/injury-map';

interface Cadence {
  daily: boolean;
  weekly: boolean;
  mesocycleWeeks: number;
}

const SCALE = [1, 2, 3, 4, 5];

export function CheckInSection({ cadence }: { cadence: Cadence }) {
  const router = useRouter();
  const [open, setOpen] = useState<'daily' | 'weekly' | null>(null);
  const [energia, setEnergia] = useState<number | null>(null);
  const [sueno, setSueno] = useState<number | null>(null);
  const [adherencia, setAdherencia] = useState<number | null>(null);
  const [peso, setPeso] = useState('');
  const [dolor, setDolor] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setEnergia(null);
    setSueno(null);
    setAdherencia(null);
    setPeso('');
    setDolor([]);
    setFile(null);
    setError(null);
  }

  async function save() {
    if (!open) return;
    setSaving(true);
    setError(null);
    try {
      const data: Record<string, unknown> = {};
      if (energia) data.energia = energia;
      if (sueno) data.sueno = sueno;
      if (adherencia) data.adherencia = adherencia;
      if (peso) data.pesoKg = Number(peso);
      if (dolor.length) data.dolor = dolor;
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: open, data }),
      });
      if (!res.ok) throw new Error();
      const { id } = (await res.json()) as { id: string };

      if (file) {
        const form = new FormData();
        form.set('file', file);
        form.set('checkInId', id);
        const up = await fetch('/api/photos', { method: 'POST', body: form });
        if (!up.ok) throw new Error('foto');
      }
      setOpen(null);
      reset();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error && e.message === 'foto'
        ? 'Check-in guardado, pero la foto no se ha podido subir.'
        : 'No se ha podido guardar. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-control bg-accent/15 text-accent">
          <CalendarCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold">Check-in</p>
          <p className="text-xs text-muted">Tu feedback ajusta las próximas sesiones.</p>
        </div>
      </div>
      <div className="flex gap-2">
        {cadence.daily && (
          <Button variant="secondary" className="flex-1" onClick={() => { reset(); setOpen('daily'); }}>
            Diario
          </Button>
        )}
        <Button className="flex-1" onClick={() => { reset(); setOpen('weekly'); }}>
          Semanal
        </Button>
      </div>

      <Sheet open={open !== null} onClose={() => setOpen(null)} title={open === 'daily' ? 'Check-in diario' : 'Check-in semanal'}>
        <div className="flex flex-col gap-4">
          <ScaleField label="Energía" value={energia} onChange={setEnergia} />
          <ScaleField label="Sueño" value={sueno} onChange={setSueno} />
          {open === 'weekly' && (
            <>
              <ScaleField label="Adherencia (¿has cumplido lo planificado?)" value={adherencia} onChange={setAdherencia} />
              <Input
                label="Peso corporal (kg)"
                type="number"
                inputMode="decimal"
                placeholder="p. ej. 75.2"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
              />
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-muted">Foto de progreso (opcional, privada)</span>
                <label className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-control border border-dashed border-line bg-surface-2 px-3 py-2 text-sm text-muted">
                  <Camera className="h-5 w-5" aria-hidden />
                  {file ? file.name : 'Hacer o elegir foto'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <p className="text-xs text-muted">Solo tú puedes verla. Se guarda en almacenamiento privado.</p>
              </div>
            </>
          )}
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-muted">¿Alguna molestia esta semana?</span>
            <div className="flex flex-wrap gap-2">
              {INJURY_ZONES.map((z) => (
                <Chip
                  key={z}
                  label={INJURY_ZONE_LABELS[z]}
                  selected={dolor.includes(z)}
                  onToggle={() => setDolor((prev) => (prev.includes(z) ? prev.filter((k) => k !== z) : [...prev, z]))}
                />
              ))}
            </div>
            <p className="text-xs text-muted">Si marcas una zona, el generador la protegerá en las próximas sesiones.</p>
          </div>
          {error && <p className="text-sm text-danger" role="alert">{error}</p>}
          <Button size="lg" loading={saving} onClick={() => void save()}>Guardar check-in</Button>
        </div>
      </Sheet>
    </Card>
  );
}

function ScaleField({ label, value, onChange }: { label: string; value: number | null; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-muted">{label}</span>
      <div className="flex gap-2" role="radiogroup" aria-label={label}>
        {SCALE.map((v) => (
          <button
            key={v}
            role="radio"
            aria-checked={value === v}
            onClick={() => onChange(v)}
            className={`h-11 flex-1 rounded-control border text-sm font-medium ${
              value === v ? 'border-accent bg-accent/10 text-accent' : 'border-line bg-surface-2 text-ink'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
