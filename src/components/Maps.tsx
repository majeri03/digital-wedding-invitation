"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function Maps({ data, family }: { data?: any, family?: string }) {
  // Use specific maps based on family link, fallback to akad if not set
  let mapSrc = data?.akadMaps || "";
  if (family === "pria" && data?.priaMaps) {
    mapSrc = data.priaMaps;
  } else if (family === "wanita" && data?.wanitaMaps) {
    mapSrc = data.wanitaMaps;
  }

  // Extract simple link from iframe string (if user inputted iframe instead of just link)
  // Usually users just paste the whole iframe. For the "Buka di Aplikasi" button, we might need a generic maps link or we let them paste a specific maps URL too. For simplicity, we just use the raw mapSrc for the iframe.

  return (
    <section className="py-24 bg-brand-ivory text-brand-maroon relative">
      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-maroon flex items-center justify-center text-brand-gold">
              <MapPin size={32} />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading text-brand-maroon mb-4">Peta Lokasi Resepsi</h2>
          <p className="text-sm opacity-80 mb-8 max-w-xl mx-auto">
            Gunakan peta di bawah ini untuk memudahkan Anda menuju lokasi acara resepsi pernikahan kami.
          </p>
        </motion.div>

        {mapSrc ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-[400px] w-full relative bg-gray-200"
          >
            {mapSrc.includes('<iframe') ? (
               <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: mapSrc.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') }} />
            ) : (
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Lokasi Resepsi"
                className="grayscale-0 hover:grayscale-0 transition-all duration-700"
              ></iframe>
            )}
          </motion.div>
        ) : (
          <div className="h-[400px] w-full bg-gray-200 rounded-3xl flex items-center justify-center border-4 border-white shadow-xl">
            <p className="text-gray-500 italic">Peta lokasi belum ditambahkan.</p>
          </div>
        )}
      </div>
    </section>
  );
}
