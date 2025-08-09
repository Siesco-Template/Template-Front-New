// 1. Custom hook: Qalan saniyəni hesablamaq (verilən tarixə görə)
import { useEffect, useState } from 'react';

export const useCountdownToDate = (targetDate: Date) => {
  const calculateRemaining = () => Math.max(0, Math.floor((targetDate.getTime() - new Date().getTime()) / 1000));

  const [secondsLeft, setSecondsLeft] = useState<number>(calculateRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(calculateRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return secondsLeft;
};

// 2. Custom hook: Saniyədən geri sayan hook
export const useCountdownFromSeconds = (initialSeconds: number) => {
  const [seconds, setSeconds] = useState<number>(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  return seconds;
};

// 3. Custom hook: Saniyəni formatlanmış string kimi qaytarır
export const useFormattedTimer = (seconds: number): string => {
  const formatTime = () => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const format = (n: number) => n.toString().padStart(2, '0');

    if (h > 0) {
      return `${format(h)}:${format(m)}:${format(s)}`;
    } else {
      return `${format(m)}:${format(s)}`;
    }

    // if (h > 0) return `${format(h)}:${format(m)}:${format(s)}`;
    // if (m > 0) return `${format(m)}:${format(s)}`;
    // return `${format(s)}`;
  };

  return formatTime();
};
