"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const story = [
  {
    year: "2018",
    title: "Awal Bertemu",
    content: "Kami pertama kali bertemu di sebuah acara kebudayaan. Berawal dari sapaan sederhana, kami menemukan banyak kecocokan."
  },
  {
    year: "2021",
    title: "Menjalin Kasih",
    content: "Setelah saling mengenal lebih dekat, kami memutuskan untuk memulai sebuah komitmen yang lebih serius."
  },
  {
    year: "2025",
    title: "Lamaran (Mappetuada)",
    content: "Dengan restu dari kedua keluarga besar, prosesi Mappetuada dilaksanakan dengan lancar dan penuh khidmat."
  }
];

export default function LoveStory() {
  return (
    <section className="py-24 bg-brand-ivory text-brand-maroon relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading text-brand-maroon mb-4">Kisah Cinta</h2>
          <p className="max-w-xl mx-auto text-sm opacity-80">
            Perjalanan cinta kami hingga akhirnya memutuskan untuk hidup bersama dalam ikatan suci pernikahan.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-brand-gold/50"></div>
          
          <div className="space-y-12">
            {story.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`flex items-center justify-between w-full ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
              >
                <div className="w-5/12"></div>
                <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-brand-maroon text-brand-gold border-4 border-brand-ivory shadow-lg">
                  <Heart size={16} fill="currentColor" />
                </div>
                <div className={`w-5/12 bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(107,15,26,0.05)] border border-brand-maroon/10 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                  <span className="text-brand-gold font-bold mb-1 block">{item.year}</span>
                  <h3 className="text-xl font-heading mb-2">{item.title}</h3>
                  <p className="text-sm opacity-80 leading-relaxed">{item.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
