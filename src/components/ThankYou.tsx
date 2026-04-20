"use client";

import { motion } from "framer-motion";

export default function ThankYou({ data }: { data: any }) {
  return (
    <section className="py-20 px-6 relative flex items-center justify-center min-h-[60vh] bg-gradient-to-b from-brand-ivory to-black/5">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-heading text-brand-maroon mb-6">
            {data.thankYouTitle || "Terima Kasih"}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {data.thankYouText || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai."}
          </p>
          
          <div className="mt-12 pt-12 border-t border-brand-maroon/20">
            <p className="text-sm tracking-widest uppercase text-brand-maroon/60 font-bold mb-4">Kami yang berbahagia</p>
            <h3 className="text-3xl font-heading text-brand-gold">
              {data.groomName} & {data.brideName}
            </h3>
            <p className="text-sm mt-4 text-gray-600">Beserta Keluarga Besar</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
