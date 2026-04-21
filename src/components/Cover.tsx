"use client";

import { motion } from "framer-motion";
import { MailOpen, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface CoverProps {
  guestName: string;
  onOpen: () => void;
  data?: any;
  onMusicPermission?: (granted: boolean) => void;
}

export default function Cover({ guestName, onOpen, data, onMusicPermission }: CoverProps) {
  const [musicEnabled, setMusicEnabled] = useState(true);

  // Format Date safely
  const formattedDate = data?.weddingDate ? new Date(data.weddingDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : "Sabtu, 25 Desember 2026";
  const names = data ? `${data.groomName.split(' ')[0]} & ${data.brideName.split(' ')[0]}` : "Andi & Tenri";
  const bgImage = data?.coverBackground || "/images/bg-pattern.webp";

  const handleOpen = () => {
    // Notify parent about music permission before opening
    if (onMusicPermission) {
      onMusicPermission(musicEnabled);
    }
    onOpen();
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-maroon text-brand-ivory overflow-hidden"
    >
      {/* Background Ornaments */}
      <div 
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
        style={{ backgroundImage: `url('${bgImage}')`, opacity: data?.coverBackground ? 0.6 : 0.2 }}
      ></div>
      
      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-brand-gold rounded-full animate-sparkle"
            style={{
              width: Math.random() * 4 + 2 + "px",
              height: Math.random() * 4 + 2 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 2 + "s",
              opacity: Math.random() * 0.5 + 0.3,
            }}
          ></div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg border border-brand-gold/30 p-10 rounded-t-full bg-brand-maroon/80 backdrop-blur-sm shadow-[0_0_40px_rgba(212,175,55,0.2)]"
      >
        <h3 className="uppercase tracking-[0.3em] text-xs mb-6 text-brand-gold">The Wedding Of</h3>
        <h1 className="text-5xl md:text-6xl font-heading mb-4 text-gradient py-2">{names}</h1>
        <p className="text-sm tracking-widest mb-10 text-brand-ivory/80">{formattedDate}</p>

        <div className="mb-6 w-full border-t border-b border-brand-gold/30 py-6">
          <p className="text-xs mb-2 opacity-80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <h2 className="text-2xl font-bold mb-1 capitalize text-brand-gold">{guestName || "Tamu Undangan"}</h2>
          <p className="text-[10px] italic opacity-60">*Mohon maaf bila ada kesalahan penulisan nama/gelar</p>
        </div>

        {/* Music Permission Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mb-6 w-full"
        >
          <button
            type="button"
            onClick={() => setMusicEnabled(!musicEnabled)}
            className={`w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 text-sm ${
              musicEnabled
                ? "border-brand-gold/50 bg-brand-gold/10 text-brand-gold"
                : "border-white/20 bg-white/5 text-white/50"
            }`}
          >
            {musicEnabled ? (
              <>
                <Volume2 size={18} />
                <span>Musik akan diputar 🎵</span>
              </>
            ) : (
              <>
                <VolumeX size={18} />
                <span>Musik dimatikan</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-brand-ivory/40 mt-2">Ketuk untuk mengubah pengaturan musik</p>
        </motion.div>

        <button
          onClick={handleOpen}
          className="group relative flex items-center gap-2 px-8 py-3 bg-brand-gold text-brand-maroon font-semibold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
        >
          <span className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -translate-x-full skew-x-12"></span>
          <MailOpen size={18} />
          <span>Buka Undangan</span>
        </button>
      </motion.div>

      {/* Decorative corners */}
      <svg className="absolute top-4 left-4 w-16 h-16 opacity-80 text-brand-gold" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0v30c0 38.66 31.34 70 70 70h30v-10H70c-33.137 0-60-26.863-60-60V0H0z" fill="currentColor"/>
      </svg>
      <svg className="absolute top-4 right-4 w-16 h-16 opacity-80 text-brand-gold transform rotate-90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0v30c0 38.66 31.34 70 70 70h30v-10H70c-33.137 0-60-26.863-60-60V0H0z" fill="currentColor"/>
      </svg>
      <svg className="absolute bottom-4 left-4 w-16 h-16 opacity-80 text-brand-gold transform -rotate-90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0v30c0 38.66 31.34 70 70 70h30v-10H70c-33.137 0-60-26.863-60-60V0H0z" fill="currentColor"/>
      </svg>
      <svg className="absolute bottom-4 right-4 w-16 h-16 opacity-80 text-brand-gold transform rotate-180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0v30c0 38.66 31.34 70 70 70h30v-10H70c-33.137 0-60-26.863-60-60V0H0z" fill="currentColor"/>
      </svg>
    </motion.div>
  );
}
