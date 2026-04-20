"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Heart, Smartphone, LayoutDashboard, Send, Gift, Users, ChevronRight, Star } from "lucide-react";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800 overflow-hidden font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Heart className="text-[#6B0F1A]" fill="#6B0F1A" size={24} />
          <span className="text-xl font-bold font-heading text-gray-900">NikahYuk<span className="text-[#D4AF37]">.SaaS</span></span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/admin" className="text-sm font-semibold text-gray-600 hover:text-[#6B0F1A] transition">Login Partner</Link>
          <Link href="/admin" className="px-5 py-2.5 bg-[#6B0F1A] text-white text-sm font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-[#8E1422] transition-all transform hover:-translate-y-0.5">
            Mulai Bisnis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center text-center min-h-[90vh] justify-center">
        {/* Background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-600 mb-8 shadow-sm">
            <Sparkles size={14} className="text-[#D4AF37]" />
            <span>Platform SaaS Undangan Digital #1 di Indonesia</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-heading font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            Bangun Bisnis Undangan <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B0F1A] to-[#D4AF37]">Dalam 5 Menit.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Tidak perlu pusing coding. Buat ribuan undangan klien dengan tema premium, kelola RSVP, dan terima amplop digital secara otomatis melalui satu Dashboard Pintar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin" className="px-8 py-4 bg-gradient-to-r from-[#6B0F1A] to-[#8E1422] text-[#D4AF37] font-bold rounded-full shadow-[0_10px_40px_rgba(107,15,26,0.3)] hover:shadow-[0_15px_50px_rgba(107,15,26,0.4)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 text-lg">
              Coba Dashboard Gratis <ChevronRight size={20} />
            </Link>
            <Link href="/invite/demo" className="px-8 py-4 bg-white text-gray-800 font-bold rounded-full border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-lg">
              <Smartphone size={20} /> Lihat Demo Undangan
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Mockup Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-full max-w-5xl mx-auto mt-20 z-10"
        >
          <div className="rounded-2xl border border-white/40 bg-white/30 backdrop-blur-xl p-2 shadow-2xl relative overflow-hidden ring-1 ring-gray-900/5">
            <div className="absolute top-0 left-0 w-full h-8 bg-gray-100/80 border-b border-gray-200/50 flex items-center px-4 gap-2 rounded-t-xl">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" alt="Dashboard Preview" className="w-full h-auto rounded-xl mt-6 opacity-90 mix-blend-multiply" />
            
            {/* Floating UI Elements */}
            <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -left-10 top-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600"><Users size={24}/></div>
              <div><p className="text-xs text-gray-500 font-bold uppercase">RSVP Masuk</p><p className="text-xl font-bold">1,240 Tamu</p></div>
            </motion.div>
            <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -right-10 bottom-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600"><Gift size={24}/></div>
              <div><p className="text-xs text-gray-500 font-bold uppercase">Amplop Digital</p><p className="text-xl font-bold">Rp 15.4M</p></div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">Fitur Lengkap Skala Enterprise</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Sistem yang dirancang khusus untuk vendor undangan. Semua fitur yang Anda butuhkan untuk melayani ribuan klien tanpa lag.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: LayoutDashboard, title: "Multi-Tenant Dashboard", desc: "Satu akun admin untuk kelola ratusan klien pernikahan sekaligus dengan database terpisah." },
              { icon: Smartphone, title: "Desain Premium Auto-Fit", desc: "Tema elegan yang responsif di semua perangkat. Klien Anda pasti takjub dengan hasilnya." },
              { icon: Send, title: "Sebar Undangan Dinamis", desc: "Generate link khusus untuk setiap tamu, lengkap dengan fitur salam 'Kepada Yth. Bapak/Ibu'." },
              { icon: Users, title: "Real-time RSVP & Analytics", desc: "Pantau jumlah tamu yang akan hadir secara live. Sangat berguna untuk manajemen katering." },
              { icon: Gift, title: "Amplop Digital terintegrasi", desc: "Terima kado pernikahan tanpa potongan biaya. Dukung transfer Bank dan QRIS." },
              { icon: Sparkles, title: "Integrasi Desain Canva", desc: "Klien bisa desain di Canva dan upload ke sistem kami. Teks akan otomatis menyesuaikan gambar." },
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-red-50 text-[#6B0F1A] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feat.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#6B0F1A]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Heart className="mx-auto text-[#D4AF37] mb-6" size={48} fill="#D4AF37" />
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">Siap Menjadi Vendor Undangan Digital Nomor 1?</h2>
          <p className="text-[#D4AF37] text-xl mb-10 max-w-2xl mx-auto">Tinggalkan cara manual. Gunakan platform kami dan tingkatkan omset bisnis Anda berkali-kali lipat.</p>
          <Link href="/admin" className="inline-flex items-center gap-2 px-10 py-5 bg-[#D4AF37] text-[#6B0F1A] font-bold rounded-full hover:bg-white transition-colors text-xl shadow-2xl transform hover:scale-105">
            Daftar Sekarang - Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <p className="flex items-center justify-center gap-2">
          Dibuat dengan <Heart size={16} className="text-red-500" fill="currentColor" /> untuk pebisnis Indonesia
        </p>
        <p className="mt-2 text-sm">&copy; 2026 NikahYuk SaaS. All rights reserved.</p>
      </footer>
    </main>
  );
}
