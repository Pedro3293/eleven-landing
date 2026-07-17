/**
 * Asignación automática de metodología a partir del perfil (usada por el onboarding).
 * Determinista y explicable: puntúa cada metodología y devuelve ranking con razones.
 */
import { METHODOLOGIES } from './methodologies';
import type { MethodologyConfig, ProfileInput } from './types';

export interface MethodologyMatch {
  methodology: MethodologyConfig;
  score: number;
  reasons: string[];
}

const GYM_EQUIPMENT = ['barbell', 'dumbbell', 'cable', 'leverage machine', 'smith machine'];

export function rankMethodologies(profile: ProfileInput): MethodologyMatch[] {
  const hasGym = profile.equipment.some((e) => GYM_EQUIPMENT.includes(e));
  const onlyBodyweight =
    profile.equipment.length === 0 ||
    profile.equipment.every((e) => ['body weight', 'band', 'resistance band', 'assisted'].includes(e));

  const matches = METHODOLOGIES.map((m) => {
    let score = 0;
    const reasons: string[] = [];

    if (m.goals.includes(profile.goal)) {
      score += 3;
      reasons.push('encaja con tu objetivo');
    }
    if (m.experiences.includes(profile.experience)) {
      score += 3;
      reasons.push('adecuada a tu experiencia');
    } else if (profile.experience === 'principiante') {
      score -= 4; // no empujar a un principiante a splits avanzados
    }
    if (m.daysPerWeekOptions.includes(profile.daysPerWeek)) {
      score += 2;
      reasons.push(`funciona con ${profile.daysPerWeek} días/semana`);
    } else {
      const closest = closestDays(m, profile.daysPerWeek);
      score -= Math.abs(closest - profile.daysPerWeek);
    }
    if (m.bodyweightOnly && onlyBodyweight) {
      score += 4;
      reasons.push('no necesitas material');
    }
    if (!m.bodyweightOnly && onlyBodyweight) {
      score -= 5; // requeriría material que no hay
    }
    if (m.bodyweightOnly && hasGym) {
      score -= 1; // con gimnasio completo hay opciones con más margen de carga
    }
    return { methodology: m, score, reasons };
  });

  return matches.sort((a, b) => b.score - a.score);
}

export function assignMethodology(profile: ProfileInput): MethodologyMatch {
  return rankMethodologies(profile)[0];
}

/** Frecuencia semanal efectiva del plan: la opción soportada más cercana a la deseada. */
export function closestDays(m: MethodologyConfig, desired: number): number {
  return m.daysPerWeekOptions.reduce((best, d) =>
    Math.abs(d - desired) < Math.abs(best - desired) ? d : best,
  );
}
