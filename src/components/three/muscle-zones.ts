/** Mapa grupo muscular (dataset) → zona de la figura, compartido por 3D y fallback 2D. */

export type FigureZone =
  | 'shoulders'
  | 'chest'
  | 'arms'
  | 'forearms'
  | 'core'
  | 'back'
  | 'glutes'
  | 'quads'
  | 'hamstrings'
  | 'calves';

const MUSCLE_TO_ZONE: Record<string, FigureZone> = {
  deltoids: 'shoulders',
  shoulders: 'shoulders',
  'rotator cuff': 'shoulders',
  trapezius: 'shoulders',
  traps: 'shoulders',
  chest: 'chest',
  biceps: 'arms',
  triceps: 'arms',
  forearms: 'forearms',
  'wrist extensors': 'forearms',
  'wrist flexors': 'forearms',
  wrists: 'forearms',
  hands: 'forearms',
  abdominals: 'core',
  core: 'core',
  obliques: 'core',
  'hip flexors': 'core',
  lats: 'back',
  'latissimus dorsi': 'back',
  'upper back': 'back',
  'lower back': 'back',
  rhomboids: 'back',
  glutes: 'glutes',
  quadriceps: 'quads',
  hamstrings: 'hamstrings',
  calves: 'calves',
  soleus: 'calves',
};

/** Intensidad 0..1 por zona a partir de series por grupo muscular. */
export function zoneIntensities(rows: { muscleGroup: string; sets: number }[]): Partial<Record<FigureZone, number>> {
  const acc: Partial<Record<FigureZone, number>> = {};
  for (const r of rows) {
    const zone = MUSCLE_TO_ZONE[r.muscleGroup];
    if (!zone) continue;
    acc[zone] = (acc[zone] ?? 0) + r.sets;
  }
  const max = Math.max(...Object.values(acc), 1);
  for (const k of Object.keys(acc) as FigureZone[]) acc[k] = acc[k]! / max;
  return acc;
}
