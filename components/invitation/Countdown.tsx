'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: string;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTime({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const TimeUnit = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 md:w-24 md:h-24 backdrop-blur-md bg-white/30 rounded-xl border border-white/50 flex items-center justify-center mb-2">
        <span className="text-3xl md:text-4xl font-serif text-gray-800">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wider">{label}</p>
    </div>
  );

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-12">
          Menghitung Hari Istimewa
        </h2>

        <div className="flex justify-center gap-4 md:gap-6">
          <TimeUnit label="Hari" value={time.days} />
          <TimeUnit label="Jam" value={time.hours} />
          <TimeUnit label="Menit" value={time.minutes} />
          <TimeUnit label="Detik" value={time.seconds} />
        </div>
      </div>
    </section>
  );
}
