'use client';

import { useState } from 'react';
import { FaMusic, FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';

interface FooterProps {
  coupleNames: string;
  invitationCode: string;
}

export default function Footer({ coupleNames, invitationCode }: FooterProps) {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invitation/${invitationCode}`;

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Music player */}
        <div className="flex items-center justify-center gap-3 mb-12 pb-12 border-b border-gray-700">
          <button
            onClick={() => setMusicPlaying(!musicPlaying)}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all"
          >
            <FaMusic />
          </button>
          <span className="text-sm">{musicPlaying ? 'Background Music (ON)' : 'Background Music (OFF)'}</span>
          {musicPlaying && (
            <audio autoPlay loop className="hidden">
              <source src="/music/wedding.mp3" type="audio/mpeg" />
            </audio>
          )}
        </div>

        {/* Share buttons */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-400 mb-4">Bagikan Undangan Ini</p>
          <div className="flex justify-center gap-4">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Hai! Aku diundang ke pernikahan ${coupleNames}. Lihat undangannya di ${invitationUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-green-600 hover:bg-green-700 rounded-full transition-colors"
            >
              <FaWhatsapp size={20} />
            </a>
            <a
              href={`https://www.instagram.com/share?url=${invitationUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-pink-600 hover:bg-pink-700 rounded-full transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${invitationUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
            >
              <FaFacebook size={20} />
            </a>
          </div>
        </div>

        {/* Bottom info */}
        <div className="text-center text-sm text-gray-400">
          <p>Terima kasih telah menjadi bagian dari momen istimewa kami</p>
          <p className="mt-2">
            © 2024 Digital Wedding Invitation • Made with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
