"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Countdown({ data }: { data?: any }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Default to a future date if not provided
    const targetDateStr = data?.weddingDate && data?.akadTime 
      ? `${data.weddingDate}T${data.akadTime}:00` 
      : "2026-12-25T09:00:00";
      
    const targetDate = new Date(targetDateStr).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.weddingDate, data?.akadTime]);

  return (
    <section className="py-20 bg-brand-maroon text-brand-ivory relative overflow-hidden">
      {/* Ornaments */}
      <div className="absolute inset-0 bg-[url('/images/bg-pattern.webp')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading text-brand-gold mb-4">Menuju Hari Bahagia</h2>
          <p className="text-sm opacity-80 mb-10 max-w-lg mx-auto tracking-wide">
            Waktu terus berlalu, mendebarkan namun penuh harap. Kami menantikan kehadiran Anda pada momen bahagia ini.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              { label: "Hari", value: timeLeft.days },
              { label: "Jam", value: timeLeft.hours },
              { label: "Menit", value: timeLeft.minutes },
              { label: "Detik", value: timeLeft.seconds },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
                className="w-20 h-20 md:w-28 md:h-28 flex flex-col items-center justify-center border border-brand-gold/30 bg-brand-maroon/50 backdrop-blur-sm rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.1)]"
              >
                <span className="text-2xl md:text-4xl font-heading font-bold text-brand-gold">{item.value}</span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest mt-1 opacity-80">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
