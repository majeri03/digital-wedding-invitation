"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Couple({ data }: { data?: any }) {
  const groomName = data?.groomName || "Andi Pangerang";
  const brideName = data?.brideName || "Tenri Abeng";
  
  // Format parents name by splitting by line breaks or '&' if needed, but since it's a textarea, let's keep line breaks if they exist, or just render it directly.
  const groomParents = data?.groomParents || "Bapak Andi Muhammad & Ibu Hj. Fatimah";
  const brideParents = data?.brideParents || "Bapak H. Daeng Mappanyukki & Ibu Hj. Siti Aminah";

  return (
    <section className="py-24 bg-brand-maroon text-brand-ivory relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[url('/images/bg-pattern.webp')] bg-cover opacity-10 mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading text-brand-gold mb-4">Sang Mempelai</h2>
          <p className="max-w-xl mx-auto text-sm opacity-80">
            Dengan memohon Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami:
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
          {/* Groom */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <div className="relative w-64 h-80 mb-6 rounded-t-full border-4 border-brand-gold/50 p-2 overflow-hidden shadow-2xl">
              <div className="w-full h-full rounded-t-full overflow-hidden bg-brand-ivory/10">
                 {/* Provide placeholder or generated image */}
                 <div className="w-full h-full bg-[url('/images/groom.jpg')] bg-cover bg-center"></div>
              </div>
            </div>
            <h3 className="text-3xl font-heading text-brand-gold mb-2">{groomName}</h3>
            <p className="font-bold mb-1">Putra dari:</p>
            <p className="text-sm opacity-80 whitespace-pre-line">{groomParents}</p>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-5xl font-heading text-brand-gold italic"
          >
            &
          </motion.div>

          {/* Bride */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <div className="relative w-64 h-80 mb-6 rounded-t-full border-4 border-brand-gold/50 p-2 overflow-hidden shadow-2xl">
              <div className="w-full h-full rounded-t-full overflow-hidden bg-brand-ivory/10">
                 {/* Provide placeholder or generated image */}
                 <div className="w-full h-full bg-[url('/images/bride.jpg')] bg-cover bg-center"></div>
              </div>
            </div>
            <h3 className="text-3xl font-heading text-brand-gold mb-2">{brideName}</h3>
            <p className="font-bold mb-1">Putri dari:</p>
            <p className="text-sm opacity-80 whitespace-pre-line">{brideParents}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
