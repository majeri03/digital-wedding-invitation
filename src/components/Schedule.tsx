"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function Schedule({ data, family }: { data?: any, family?: string }) {
  const formattedDate = data?.weddingDate ? new Date(data.weddingDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : "Sabtu, 25 Desember 2026";
  
  const isWanita = family === "wanita";
  const resepsiTime = isWanita ? (data?.wanitaTime || "11:00") : (data?.priaTime || "11:00");
  const resepsiLocation = isWanita ? (data?.wanitaLocation || "Gedung Manunggal Makassar") : (data?.priaLocation || "Hotel Claro Makassar");
  const akadTime = data?.akadTime || "09:00";
  const akadLocation = data?.akadLocation || "Masjid Raya Makassar";

  return (
    <section className="py-24 bg-brand-maroon text-brand-ivory relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/images/bg-pattern.webp')] bg-cover opacity-10 mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading text-brand-gold mb-4">Jadwal Acara</h2>
          <p className="max-w-xl mx-auto text-sm opacity-80">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Akad */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-brand-ivory/10 backdrop-blur-md border border-brand-gold/30 rounded-3xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/20 rounded-bl-full -z-10 blur-xl"></div>
            
            <h3 className="text-3xl font-heading text-brand-gold mb-6 border-b border-brand-gold/20 pb-4">Akad Nikah</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3">
                <Calendar className="text-brand-gold" size={20} />
                <p>{formattedDate}</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Clock className="text-brand-gold" size={20} />
                <p>{akadTime} WITA - Selesai</p>
              </div>
              <div className="flex items-start justify-center gap-3">
                <MapPin className="text-brand-gold flex-shrink-0 mt-1" size={20} />
                <p className="text-sm">{akadLocation}</p>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="#maps" className="inline-block px-6 py-2 border border-brand-gold text-brand-gold rounded-full text-sm hover:bg-brand-gold hover:text-brand-maroon transition-colors">
                Lihat Lokasi
              </a>
              <a 
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Akad+Nikah+${data?.groomName}+%26+${data?.brideName}&dates=${data?.weddingDate?.replace(/-/g, '')}T${akadTime?.replace(':', '')}00Z/${data?.weddingDate?.replace(/-/g, '')}T${parseInt(akadTime?.split(':')[0] || "09") + 2}0000Z&details=Acara+Akad+Nikah&location=${akadLocation}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-brand-gold text-brand-maroon rounded-full text-sm font-semibold hover:bg-white transition-colors"
              >
                Simpan ke Kalender
              </a>
            </div>
          </motion.div>

          {/* Resepsi */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-brand-ivory/10 backdrop-blur-md border border-brand-gold/30 rounded-3xl p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-24 h-24 bg-brand-gold/20 rounded-br-full -z-10 blur-xl"></div>
            
            <h3 className="text-3xl font-heading text-brand-gold mb-6 border-b border-brand-gold/20 pb-4">Resepsi</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3">
                <Calendar className="text-brand-gold" size={20} />
                <p>{formattedDate}</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Clock className="text-brand-gold" size={20} />
                <p>{resepsiTime} WITA - Selesai</p>
              </div>
              <div className="flex items-start justify-center gap-3">
                <MapPin className="text-brand-gold flex-shrink-0 mt-1" size={20} />
                <p className="text-sm">{resepsiLocation}</p>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <a href="#maps" className="inline-block px-6 py-2 border border-brand-gold text-brand-gold rounded-full text-sm hover:bg-brand-gold hover:text-brand-maroon transition-colors">
                Lihat Lokasi
              </a>
              <a 
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Resepsi+Pernikahan+${data?.groomName}+%26+${data?.brideName}&dates=${data?.weddingDate?.replace(/-/g, '')}T${resepsiTime?.replace(':', '')}00Z/${data?.weddingDate?.replace(/-/g, '')}T${parseInt(resepsiTime?.split(':')[0] || "11") + 4}0000Z&details=Acara+Resepsi+Pernikahan&location=${resepsiLocation}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-brand-gold text-brand-maroon rounded-full text-sm font-semibold hover:bg-white transition-colors shadow-lg shadow-brand-gold/20"
              >
                Simpan ke Kalender
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
