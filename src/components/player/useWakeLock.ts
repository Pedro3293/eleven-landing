'use client';

import { useEffect } from 'react';

/** Mantiene la pantalla encendida durante la sesión (Wake Lock API, con re-adquisición). */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let released = false;

    const acquire = async () => {
      try {
        lock = await navigator.wakeLock.request('screen');
      } catch {
        // denegado (batería baja, etc.): la sesión sigue funcionando sin wake lock
      }
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible' && !released) void acquire();
    };

    void acquire();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      released = true;
      document.removeEventListener('visibilitychange', onVisible);
      void lock?.release().catch(() => undefined);
    };
  }, [active]);
}
