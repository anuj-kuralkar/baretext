import { useEffect, useState } from "react";

export function useCountdown(targetTimestamp: number): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    if (Date.now() >= targetTimestamp) return;

    const interval = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= targetTimestamp) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return Math.max(0, Math.ceil((targetTimestamp - now) / 1000));
}
