"use client";

import { motion } from "framer-motion";

const defaultImages = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
];

export default function Gallery({ data }: { data?: any }) {
  const images = data?.galleryImages && data.galleryImages.length > 0 ? data.galleryImages : defaultImages;

  return (
    <section className="py-24 bg-brand-ivory text-brand-maroon relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading text-brand-maroon mb-4">Momen Bahagia</h2>
          <p className="max-w-xl mx-auto text-sm opacity-80">
            Koleksi momen indah kebersamaan kami.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {images.map((src: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-white"
            >
              <div className="w-full h-full bg-brand-maroon/20">
                 <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${src})` }}></div>
              </div>
              <div className="absolute inset-0 bg-brand-maroon/0 hover:bg-brand-maroon/30 transition-colors duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
