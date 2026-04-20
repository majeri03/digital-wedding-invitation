"use client";

import { motion } from "framer-motion";

export default function Quote({ data }: { data?: any }) {
  const quote = data?.heroQuote || '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."';
  const quoteSource = data?.heroQuoteSource || '(QS. Ar-Rum: 21)';

  return (
    <section className="py-20 bg-brand-ivory text-brand-maroon relative overflow-hidden px-6 border-y border-brand-gold/20">
      <div className="container mx-auto max-w-3xl text-center relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-6 opacity-40 text-brand-gold"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-lg md:text-xl leading-loose font-light italic mb-6">
            {quote}
          </p>
          <p className="text-sm font-bold tracking-widest uppercase text-brand-gold">
            {quoteSource}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
