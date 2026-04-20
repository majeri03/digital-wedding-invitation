"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function RSVP({ guestName, slug }: { guestName?: string, slug: string }) {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const count = parseInt((form.elements.namedItem("count") as HTMLSelectElement).value);

    try {
      await addDoc(collection(db, "rsvp"), {
        clientSlug: slug,
        name,
        count,
        status,
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Error RSVP: ", error);
      alert("Gagal mengirim RSVP, pastikan koneksi internet stabil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-brand-maroon text-brand-ivory relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/bg-pattern.webp')] bg-cover opacity-10 mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 max-w-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-heading text-brand-gold mb-4">RSVP</h2>
          <p className="text-sm opacity-80">
            Mohon konfirmasi kehadiran Bapak/Ibu/Saudara/i melalui form di bawah ini.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-brand-ivory text-brand-maroon p-8 rounded-3xl shadow-2xl relative"
        >
          {/* Form decorative corners */}
          <svg className="absolute top-2 left-2 w-12 h-12 opacity-50 text-brand-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0v30c0 38.66 31.34 70 70 70h30v-10H70c-33.137 0-60-26.863-60-60V0H0z" fill="currentColor"/>
          </svg>
          <svg className="absolute bottom-2 right-2 w-12 h-12 opacity-50 text-brand-gold transform rotate-180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0v30c0 38.66 31.34 70 70 70h30v-10H70c-33.137 0-60-26.863-60-60V0H0z" fill="currentColor"/>
          </svg>
          
          <div className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-bold mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                defaultValue={guestName || ""}
                required
                className="w-full px-4 py-3 rounded-xl border border-brand-maroon/20 focus:outline-none focus:border-brand-gold bg-transparent transition-colors"
                placeholder="Masukkan nama Anda"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">Jumlah Kehadiran</label>
              <select name="count" className="w-full px-4 py-3 rounded-xl border border-brand-maroon/20 focus:outline-none focus:border-brand-gold bg-transparent transition-colors">
                <option value="1">1 Orang</option>
                <option value="2">2 Orang</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">Konfirmasi Kehadiran</label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="status" value="hadir" className="peer sr-only" onChange={(e) => setStatus(e.target.value)} required />
                  <div className="text-center py-3 border border-brand-maroon/20 rounded-xl peer-checked:bg-brand-gold peer-checked:text-white peer-checked:border-brand-gold transition-colors text-sm font-semibold">
                    Hadir
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="status" value="tidak_hadir" className="peer sr-only" onChange={(e) => setStatus(e.target.value)} required />
                  <div className="text-center py-3 border border-brand-maroon/20 rounded-xl peer-checked:bg-brand-maroon peer-checked:text-white peer-checked:border-brand-maroon transition-colors text-sm font-semibold">
                    Tidak Hadir
                  </div>
                </label>
              </div>
            </div>
            
            {isSuccess && (
              <div className="p-3 bg-green-100 text-green-700 text-sm rounded-xl text-center font-bold">
                Terima kasih atas konfirmasinya!
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-4 bg-brand-maroon text-brand-gold font-bold rounded-xl hover:bg-brand-maroon/90 transition-colors shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Mengirim..." : (isSuccess ? "Terkirim" : "Kirim Konfirmasi")}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
