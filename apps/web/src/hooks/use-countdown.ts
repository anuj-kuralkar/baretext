import { useEffect, useState } from "react";

const SECOND_MS = 1000;

/**
 * Whole seconds remaining until `targetTimestamp`, clamped at 0. Ticks once
 * per second and stops (clears its interval) once the target time passes.
 */
export function useCountdown(targetTimestamp: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    if (Date.now() >= targetTimestamp) return;

    const interval = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= targetTimestamp) clearInterval(interval);
    }, SECOND_MS);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return Math.max(0, Math.ceil((targetTimestamp - now) / SECOND_MS));
}
