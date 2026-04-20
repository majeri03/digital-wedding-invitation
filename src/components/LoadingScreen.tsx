"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // wait for exit animation
    }, 2500); // minimum loading time for elegant effect

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-maroon text-brand-gold overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/images/bg-pattern.webp')] bg-cover opacity-10 mix-blend-overlay"></div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Elegant Spinner */}
            <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-brand-gold opacity-50"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border-b-2 border-l-2 border-brand-gold/70 opacity-50"
              />
              <span className="font-heading text-2xl italic">A & T</span>
            </div>
            
            <h1 className="text-xl tracking-[0.2em] uppercase text-brand-ivory mb-2">The Wedding</h1>
            <p className="text-xs tracking-widest opacity-60">Memuat Momen Indah...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
