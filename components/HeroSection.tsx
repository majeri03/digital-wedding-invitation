'use client';

import { Couple } from '@/lib/types';
import Image from 'next/image';

interface HeroSectionProps {
  couple: Couple;
}

export default function HeroSection({ couple }: HeroSectionProps) {
  return (
    <div
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${couple.colors.primary}80 0%, ${couple.colors.secondary}80 100%)`,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 backdrop-blur-md bg-white/20 rounded-3xl p-12 border border-white/30 shadow-2xl max-w-2xl mx-4">
        <div className="text-center space-y-6">
          {/* Royal Title */}
          <div className="space-y-2">
            <p className="text-sm tracking-[0.3em] uppercase text-white/80">Royal Wedding</p>
            <h1 className="text-5xl md:text-6xl font-serif text-white drop-shadow-lg">
              {couple.brideName} & {couple.groomName}
            </h1>
          </div>

          {/* Decorative line */}
          <div className="flex items-center justify-center space-x-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/40"></div>
          </div>

          {/* Wedding Details */}
          <div className="space-y-3 text-white/90">
            <p className="text-lg">{new Date(couple.weddingDate).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</p>
            <p className="text-sm">{couple.location}</p>
          </div>

          {/* CTA Button */}
          <button className="mt-8 px-8 py-3 bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-800 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105">
            Open Invitation
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
