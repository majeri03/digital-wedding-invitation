"use client";

import { motion } from "framer-motion";

export default function Intro({ data }: { data?: any }) {
  const greeting = data?.introGreeting || "Assalamu'alaikum Warahmatullahi Wabarakatuh";
  const text = data?.introText || "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan putra-putri kami.";

  return (
    <section className="py-20 bg-brand-ivory text-brand-maroon relative overflow-hidden px-6">
      <div className="container mx-auto max-w-2xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-8 text-brand-gold"
        >
          {/* Bismillah Calligraphy (Placeholder SVG or elegant font) */}
          <h2 className="text-4xl md:text-5xl font-heading" style={{ fontFamily: "serif" }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-xl md:text-2xl font-bold mb-6">{greeting}</h3>
          <p className="text-sm md:text-base leading-relaxed opacity-80 italic">
            "{text}"
          </p>
        </motion.div>
      </div>
    </section>
  );
}
