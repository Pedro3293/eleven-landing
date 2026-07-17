'use client';

/**
 * Figura anatómica estilizada (low-poly, primitivas) con los músculos trabajados
 * resaltados en acento. Ligera a propósito: sin modelos externos, rota despacio.
 */
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { FigureZone } from './muscle-zones';

const BASE = '#2A2E34';
const ACCENT = { r: 200 / 255, g: 255 / 255, b: 46 / 255 };

function zoneColor(intensity: number | undefined): string {
  const t = intensity ?? 0;
  const base = { r: 0x2a / 255, g: 0x2e / 255, b: 0x34 / 255 };
  const mix = (a: number, b: number) => Math.round((a + (b - a) * t) * 255);
  return `rgb(${mix(base.r, ACCENT.r)}, ${mix(base.g, ACCENT.g)}, ${mix(base.b, ACCENT.b)})`;
}

function Figure({ zones, animate }: { zones: Partial<Record<FigureZone, number>>; animate: boolean }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (animate && group.current) group.current.rotation.y += delta * 0.45;
  });

  const c = useMemo(
    () => ({
      head: BASE,
      shoulders: zoneColor(zones.shoulders),
      chest: zoneColor(zones.chest),
      arms: zoneColor(zones.arms),
      forearms: zoneColor(zones.forearms),
      core: zoneColor(zones.core),
      back: zoneColor(zones.back),
      glutes: zoneColor(zones.glutes),
      quads: zoneColor(zones.quads),
      hamstrings: zoneColor(zones.hamstrings),
      calves: zoneColor(zones.calves),
    }),
    [zones],
  );

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      {/* cabeza */}
      <mesh position={[0, 1.62, 0]}>
        <sphereGeometry args={[0.21, 20, 16]} />
        <meshStandardMaterial color={c.head} roughness={0.6} />
      </mesh>
      {/* hombros */}
      {[-0.42, 0.42].map((x) => (
        <mesh key={`sh${x}`} position={[x, 1.28, 0]}>
          <sphereGeometry args={[0.17, 16, 12]} />
          <meshStandardMaterial color={c.shoulders} roughness={0.55} />
        </mesh>
      ))}
      {/* pecho (delante) */}
      <mesh position={[0, 1.12, 0.09]}>
        <boxGeometry args={[0.56, 0.34, 0.18]} />
        <meshStandardMaterial color={c.chest} roughness={0.55} />
      </mesh>
      {/* espalda (detrás) */}
      <mesh position={[0, 1.05, -0.1]}>
        <boxGeometry args={[0.6, 0.6, 0.14]} />
        <meshStandardMaterial color={c.back} roughness={0.55} />
      </mesh>
      {/* core */}
      <mesh position={[0, 0.78, 0.06]}>
        <boxGeometry args={[0.42, 0.36, 0.16]} />
        <meshStandardMaterial color={c.core} roughness={0.55} />
      </mesh>
      {/* brazos y antebrazos */}
      {[-0.5, 0.5].map((x) => (
        <group key={`arm${x}`}>
          <mesh position={[x, 1.02, 0]} rotation={[0, 0, x > 0 ? -0.12 : 0.12]}>
            <capsuleGeometry args={[0.09, 0.34, 6, 12]} />
            <meshStandardMaterial color={c.arms} roughness={0.55} />
          </mesh>
          <mesh position={[x * 1.13, 0.6, 0]} rotation={[0, 0, x > 0 ? -0.16 : 0.16]}>
            <capsuleGeometry args={[0.07, 0.3, 6, 12]} />
            <meshStandardMaterial color={c.forearms} roughness={0.55} />
          </mesh>
        </group>
      ))}
      {/* glúteos */}
      <mesh position={[0, 0.52, -0.06]}>
        <boxGeometry args={[0.44, 0.2, 0.24]} />
        <meshStandardMaterial color={c.glutes} roughness={0.55} />
      </mesh>
      {/* cuádriceps (delante) e isquios (detrás) */}
      {[-0.16, 0.16].map((x) => (
        <group key={`leg${x}`}>
          <mesh position={[x, 0.18, 0.05]}>
            <capsuleGeometry args={[0.1, 0.4, 6, 12]} />
            <meshStandardMaterial color={c.quads} roughness={0.55} />
          </mesh>
          <mesh position={[x, 0.18, -0.07]}>
            <capsuleGeometry args={[0.09, 0.38, 6, 12]} />
            <meshStandardMaterial color={c.hamstrings} roughness={0.55} />
          </mesh>
          <mesh position={[x, -0.36, -0.02]}>
            <capsuleGeometry args={[0.075, 0.34, 6, 12]} />
            <meshStandardMaterial color={c.calves} roughness={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function MuscleFigure3D({ zones, animate }: { zones: Partial<Record<FigureZone, number>>; animate: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.7, 3.1], fov: 38 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'low-power' }}
      style={{ touchAction: 'pan-y' }}
      aria-hidden
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 4]} intensity={1.1} />
      <directionalLight position={[-3, 1, -2]} intensity={0.3} color="#C8FF2E" />
      <Figure zones={zones} animate={animate} />
    </Canvas>
  );
}
