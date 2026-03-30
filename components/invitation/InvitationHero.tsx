'use client';

import { Couple } from '@/lib/types';
import { useEffect, useState } from 'react';

interface InvitationHeroProps {
  couple: Couple;
  guestName: string;
}

export default function InvitationHero({ couple, guestName }: InvitationHeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #faf9f6 0%, #f5f3ef 50%, #faf9f6 100%)`,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-5 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-10 right-5 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Small intro text */}
        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-sm md:text-base tracking-[0.2em] uppercase text-gray-600 mb-4 font-light">
            Mengundang Anda untuk merayakan
          </p>
        </div>

        {/* Main title with glassmorphism */}
        <div
          className={`transition-all duration-1000 transform delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="backdrop-blur-sm bg-white/40 rounded-3xl p-8 md:p-12 border-2 border-white/50 shadow-2xl mb-8">
            <div className="space-y-4">
              <p className="text-xs md:text-sm tracking-widest text-gray-500 font-light">ROYAL WEDDING</p>

              <h1 className="text-4xl md:text-7xl font-serif text-gray-900 leading-tight drop-shadow-sm">
                {couple.brideName}
              </h1>

              {/* Decorative element */}
              <div className="flex items-center justify-center space-x-4 my-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-400"></div>
                <span className="text-2xl text-gray-400">&</span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-400"></div>
              </div>

              <h1 className="text-4xl md:text-7xl font-serif text-gray-900 leading-tight drop-shadow-sm">
                {couple.groomName}
              </h1>
            </div>
          </div>
        </div>

        {/* Guest name */}
        <div
          className={`transition-all duration-1000 transform delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-lg md:text-xl text-gray-700 italic">
            Dengan hormat mengundang
          </p>
          <p className="text-2xl md:text-3xl font-serif text-gray-900 my-2">
            {guestName}
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className={`transition-all duration-1000 transform delay-700 mt-12 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col items-center animate-bounce">
            <p className="text-xs text-gray-500 mb-2">Scroll untuk melanjutkan</p>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
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
    </section>
  );
}
