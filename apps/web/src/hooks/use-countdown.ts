import { useEffect, useState } from "react";

const SECOND_MS = 1000;

export function useCountdown(targetTimestamp: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    // Ticks only while the counter is still running down.
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
