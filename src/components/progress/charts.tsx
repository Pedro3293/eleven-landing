'use client';

/**
 * Gráficas SVG propias (sin librerías) según la guía dataviz:
 * - una sola escala por gráfica, marcas finas, huecos de 2px, grid recesivo
 * - identidad por color con paleta categórica validada (CVD) + etiquetas directas
 * - texto siempre en tokens de texto, nunca en el color de la serie
 * En móvil el "hover" es tap: cada marca lleva <title> nativo y las series
 * llevan etiqueta directa en el extremo, así el valor nunca depende del hover.
 */

/** Paleta categórica validada sobre #121417 (script validate_palette, modo dark). */
export const CHART_COLORS = ['#7FA30D', '#1E86B0', '#C74E66', '#8E5BD0'];
const SINGLE_HUE = '#7FA30D';

const FONT = 11;

export function MuscleVolumeChart({ rows }: { rows: { muscleGroup: string; sets: number }[] }) {
  if (rows.length === 0) return <Empty text="Completa sesiones para ver tu volumen por músculo." />;
  const max = Math.max(...rows.map((r) => r.sets));
  const rowH = 26;
  const labelW = 108;
  const width = 340;
  const height = rows.length * rowH;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Series por grupo muscular en las últimas 4 semanas">
      {rows.map((r, i) => {
        const w = Math.max(4, (r.sets / max) * (width - labelW - 34));
        const y = i * rowH;
        return (
          <g key={r.muscleGroup}>
            <title>{`${labelES(r.muscleGroup)}: ${r.sets} series`}</title>
            <text x={labelW - 8} y={y + rowH / 2 + FONT / 2 - 2} textAnchor="end" fontSize={FONT} className="fill-muted" style={{ fill: 'rgb(var(--muted))' }}>
              {labelES(r.muscleGroup)}
            </text>
            <rect x={labelW} y={y + 5} width={w} height={rowH - 12} rx={4} fill={SINGLE_HUE} />
            <text x={labelW + w + 6} y={y + rowH / 2 + FONT / 2 - 2} fontSize={FONT} style={{ fill: 'rgb(var(--ink))' }}>
              {r.sets}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function LoadProgressionChart({ series }: { series: { name: string; points: { date: string; topSetKg: number }[] }[] }) {
  const usable = series.filter((s) => s.points.length >= 2);
  if (usable.length === 0) return <Empty text="Registra series con carga en varias sesiones para ver tu progresión." />;

  const width = 340;
  const height = 170;
  const pad = { l: 34, r: 8, t: 8, b: 20 };

  const allDates = [...new Set(usable.flatMap((s) => s.points.map((p) => p.date)))].sort();
  const allVals = usable.flatMap((s) => s.points.map((p) => p.topSetKg));
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals);
  const spanV = maxV - minV || 1;
  const x = (date: string) => pad.l + (allDates.indexOf(date) / Math.max(1, allDates.length - 1)) * (width - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - minV) / spanV) * (height - pad.t - pad.b);

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Progresión de la mejor serie por ejercicio">
        {/* grid recesivo: min y max */}
        {[minV, maxV].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={width - pad.r} y1={y(v)} y2={y(v)} stroke="rgb(var(--line))" strokeWidth={1} />
            <text x={pad.l - 5} y={y(v) + 4} textAnchor="end" fontSize={FONT - 1} style={{ fill: 'rgb(var(--muted))' }}>
              {v}
            </text>
          </g>
        ))}
        {usable.map((s, si) => {
          const color = CHART_COLORS[si % CHART_COLORS.length];
          const d = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.date).toFixed(1)},${y(p.topSetKg).toFixed(1)}`).join(' ');
          const last = s.points[s.points.length - 1];
          return (
            <g key={s.name}>
              <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              {s.points.map((p) => (
                <circle key={p.date} cx={x(p.date)} cy={y(p.topSetKg)} r={3.5} fill={color} stroke="rgb(var(--surface))" strokeWidth={2}>
                  <title>{`${s.name} · ${p.date}: ${p.topSetKg} kg`}</title>
                </circle>
              ))}
              <text x={x(last.date) - 4} y={y(last.topSetKg) - 7} textAnchor="end" fontSize={FONT - 1} style={{ fill: 'rgb(var(--ink))' }}>
                {last.topSetKg}
              </text>
            </g>
          );
        })}
        {/* eje temporal: primera y última fecha */}
        <text x={pad.l} y={height - 5} fontSize={FONT - 1} style={{ fill: 'rgb(var(--muted))' }}>{shortDate(allDates[0])}</text>
        <text x={width - pad.r} y={height - 5} textAnchor="end" fontSize={FONT - 1} style={{ fill: 'rgb(var(--muted))' }}>{shortDate(allDates[allDates.length - 1])}</text>
      </svg>
      <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
        {usable.map((s, si) => (
          <li key={s.name} className="flex items-center gap-1.5 text-xs text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: CHART_COLORS[si % CHART_COLORS.length] }} aria-hidden />
            {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdherenceChart({ rows }: { rows: { week: string; completed: number; target: number }[] }) {
  if (rows.length === 0) return <Empty text="Aún no hay semanas registradas." />;
  const width = 340;
  const height = 120;
  const pad = { l: 8, r: 8, t: 12, b: 18 };
  const max = Math.max(...rows.map((r) => Math.max(r.completed, r.target)), 1);
  const bw = (width - pad.l - pad.r) / rows.length;
  const y = (v: number) => pad.t + (1 - v / max) * (height - pad.t - pad.b);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Sesiones completadas por semana frente a tu objetivo">
      {rows.map((r, i) => {
        const cx = pad.l + i * bw;
        const met = r.completed >= r.target;
        return (
          <g key={r.week}>
            <title>{`Semana del ${r.week}: ${r.completed} de ${r.target} sesiones`}</title>
            <rect x={cx + bw * 0.18} y={y(r.completed)} width={bw * 0.64} height={Math.max(0, height - pad.b - y(r.completed))} rx={4} fill={SINGLE_HUE} opacity={met ? 1 : 0.45} />
            {/* objetivo como marca, no segundo eje */}
            <line x1={cx + bw * 0.1} x2={cx + bw * 0.9} y1={y(r.target)} y2={y(r.target)} stroke="rgb(var(--muted))" strokeWidth={1.5} strokeDasharray="3 3" />
            <text x={cx + bw / 2} y={height - 4} textAnchor="middle" fontSize={FONT - 2} style={{ fill: 'rgb(var(--muted))' }}>{r.week}</text>
            <text x={cx + bw / 2} y={y(r.completed) - 3} textAnchor="middle" fontSize={FONT - 1} style={{ fill: 'rgb(var(--ink))' }}>{r.completed}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function BodyweightChart({ points }: { points: { date: string; value: number }[] }) {
  if (points.length < 2) return <Empty text="Registra tu peso en los check-ins para ver la evolución." />;
  const width = 340;
  const height = 130;
  const pad = { l: 38, r: 8, t: 10, b: 18 };
  const vals = points.map((p) => p.value);
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const spanV = maxV - minV || 1;
  const x = (i: number) => pad.l + (i / (points.length - 1)) * (width - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - minV) / spanV) * (height - pad.t - pad.b);
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Evolución del peso corporal">
      {[minV, maxV].map((v) => (
        <g key={v}>
          <line x1={pad.l} x2={width - pad.r} y1={y(v)} y2={y(v)} stroke="rgb(var(--line))" strokeWidth={1} />
          <text x={pad.l - 5} y={y(v) + 4} textAnchor="end" fontSize={FONT - 1} style={{ fill: 'rgb(var(--muted))' }}>{v.toFixed(1)}</text>
        </g>
      ))}
      <path d={d} fill="none" stroke={SINGLE_HUE} strokeWidth={2} strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={p.date} cx={x(i)} cy={y(p.value)} r={3.5} fill={SINGLE_HUE} stroke="rgb(var(--surface))" strokeWidth={2}>
          <title>{`${shortDate(p.date)}: ${p.value} kg`}</title>
        </circle>
      ))}
      <text x={pad.l} y={height - 4} fontSize={FONT - 1} style={{ fill: 'rgb(var(--muted))' }}>{shortDate(points[0].date)}</text>
      <text x={width - pad.r} y={height - 4} textAnchor="end" fontSize={FONT - 1} style={{ fill: 'rgb(var(--muted))' }}>{shortDate(points[points.length - 1].date)}</text>
    </svg>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-muted">{text}</p>;
}

function shortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

const MUSCLE_ES: Record<string, string> = {
  chest: 'Pecho',
  lats: 'Dorsales',
  'latissimus dorsi': 'Dorsales',
  'upper back': 'Espalda alta',
  'lower back': 'Lumbar',
  trapezius: 'Trapecio',
  traps: 'Trapecio',
  rhomboids: 'Romboides',
  deltoids: 'Hombro',
  shoulders: 'Hombro',
  'rotator cuff': 'Manguito rotador',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  forearms: 'Antebrazo',
  'wrist extensors': 'Antebrazo',
  'wrist flexors': 'Antebrazo',
  abdominals: 'Abdomen',
  core: 'Core',
  obliques: 'Oblicuos',
  quadriceps: 'Cuádriceps',
  hamstrings: 'Isquios',
  glutes: 'Glúteo',
  calves: 'Gemelos',
  soleus: 'Sóleo',
  'hip flexors': 'Flexores de cadera',
  adductors: 'Aductores',
  abductors: 'Abductores',
};

function labelES(muscle: string): string {
  return MUSCLE_ES[muscle] ?? muscle;
}
