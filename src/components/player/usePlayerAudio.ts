'use client';

import { useCallback, useRef } from 'react';

/** Señales sonoras (WebAudio, sin assets) y vibración para los timers del player. */
export function usePlayerAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const beep = useCallback((freq = 880, durationMs = 120, volume = 0.25) => {
    try {
      if (!ctxRef.current) {
        const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        ctxRef.current = new AC();
      }
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // sin audio no se rompe nada
    }
  }, []);

  const vibrate = useCallback((pattern: number | number[] = 200) => {
    try {
      navigator.vibrate?.(pattern);
    } catch {
      // no soportado
    }
  }, []);

  /** tic corto de cuenta atrás (3,2,1) */
  const tick = useCallback(() => beep(660, 90, 0.2), [beep]);
  /** señal de fin (descanso terminado / cambio de fase) */
  const done = useCallback(() => {
    beep(880, 180, 0.3);
    setTimeout(() => beep(1174, 220, 0.3), 190);
    vibrate([120, 60, 120]);
  }, [beep, vibrate]);

  return { beep, vibrate, tick, done };
}
