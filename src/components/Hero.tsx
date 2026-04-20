"use client";

import { motion } from "framer-motion";

export default function Hero({ data }: { data?: any }) {
  const groomFirst = data ? data.groomName.split(' ')[0] : "Andi";
  const brideFirst = data ? data.brideName.split(' ')[0] : "Tenri";
  const bgImage = data?.heroBackground || "/images/hero-bg.jpg";
  const quote = data?.heroQuote || '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri..."';
  const quoteSource = data?.heroQuoteSource || '(QS. Ar-Rum: 21)';
  const subtitle = data?.heroSubtitle || 'Pernikahan Adat Bugis';

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-brand-ivory overflow-hidden py-20 px-4">
      {/* Background with parallax effect */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center mix-blend-multiply"
        style={{ backgroundImage: `url('${bgImage}')`, opacity: data?.heroBackground ? 0.6 : 0.3 }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-brand-ivory/50 via-transparent to-brand-ivory"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center"
      >
        <p className="text-sm tracking-[0.3em] uppercase text-brand-gold font-bold mb-4">{subtitle}</p>
        
        <div className="flex items-center gap-4 mb-6">
          <motion.div initial={{ width: 0 }} animate={{ width: "100px" }} transition={{ delay: 0.5, duration: 1 }} className="h-px bg-brand-gold"></motion.div>
          <span className="text-brand-maroon font-heading text-2xl">&</span>
          <motion.div initial={{ width: 0 }} animate={{ width: "100px" }} transition={{ delay: 0.5, duration: 1 }} className="h-px bg-brand-gold"></motion.div>
        </div>

        <h1 className="text-6xl md:text-8xl font-heading text-brand-maroon mb-6 leading-tight">
          {groomFirst} <br/> <span className="text-4xl text-brand-gold italic">and</span> <br/> {brideFirst}
        </h1>

        <p className="text-lg md:text-xl font-light text-brand-maroon/80 mb-10">
          {quote}
          <br/>
          <span className="text-sm italic mt-2 block">{quoteSource}</span>
        </p>
        
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest text-brand-maroon/60">Scroll Down</span>
        <div className="w-px h-16 bg-gradient-to-b from-brand-maroon to-transparent"></div>
      </motion.div>
    </section>
  );
}
