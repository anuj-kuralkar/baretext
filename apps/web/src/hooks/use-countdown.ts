import { useEffect, useState } from "react";

/**
 * Returns remaining seconds until `targetTimestamp` (in ms) is reached.
 * Automatically stops ticking when 0 is reached.
 */
export function useCountdown(targetTimestamp: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (now >= targetTimestamp) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp, now]);

  return Math.max(0, Math.ceil((targetTimestamp - now) / 1000));
}
