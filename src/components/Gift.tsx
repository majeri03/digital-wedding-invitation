"use client";

import { motion } from "framer-motion";
import { Copy, Gift as GiftIcon } from "lucide-react";

export default function Gift({ data }: { data?: any }) {
  const gifts = data?.gifts || [
    { bank: "BCA", accountNumber: "1234567890", accountName: "Andi Pangerang" },
    { bank: "Mandiri", accountNumber: "0987654321", accountName: "Tenri Abeng" }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Nomor rekening berhasil disalin!");
  };

  if (gifts.length === 0) return null;

  return (
    <section className="py-24 bg-brand-maroon text-brand-ivory relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/bg-pattern.webp')] bg-cover opacity-10 mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 max-w-3xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-gold flex items-center justify-center text-brand-maroon">
              <GiftIcon size={32} />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading text-brand-gold mb-4">Wedding Gift</h2>
          <p className="text-sm opacity-80 mb-8">
            Bagi keluarga dan sahabat yang ingin memberikan tanda kasih, dapat mengirimkan kado melalui rekening berikut:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
          {gifts.map((gift: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 + (index * 0.1) }}
              className="bg-brand-ivory/10 backdrop-blur-md border border-brand-gold/30 rounded-2xl p-6 flex flex-col items-center"
            >
              <h3 className="text-2xl font-heading text-brand-gold mb-2">{gift.bank}</h3>
              <p className="text-xl font-mono tracking-widest mb-1">{gift.accountNumber}</p>
              <p className="text-sm opacity-80 mb-6">a.n {gift.accountName}</p>
              <button
                onClick={() => copyToClipboard(gift.accountNumber)}
                className="flex items-center justify-center gap-2 w-full py-2 border border-brand-gold text-brand-gold rounded-full text-sm hover:bg-brand-gold hover:text-brand-maroon transition-colors mt-auto"
              >
                <Copy size={16} /> Salin Rekening
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
