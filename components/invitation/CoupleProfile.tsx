'use client';

import { Couple } from '@/lib/types';
import Image from 'next/image';

interface CoupleProfileProps {
  couple: Couple;
}

export default function CoupleProfile({ couple }: CoupleProfileProps) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-16">
          Kisah Cinta Kami
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Bride */}
          <div className="text-center">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-2xl blur-xl opacity-50 -z-10"></div>
              <div className="w-64 h-80 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center">
                {couple.coverImage ? (
                  <Image
                    src={couple.coverImage}
                    alt={couple.brideName}
                    width={256}
                    height={320}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="text-6xl mb-2">👰</div>
                    <p className="text-gray-600">Bride Photo</p>
                  </div>
                )}
              </div>
            </div>
            <h3 className="text-3xl font-serif text-gray-900 mb-2">{couple.brideName}</h3>
            <p className="text-gray-600 italic mb-4">Sang Ratu</p>
            <p className="text-gray-700 leading-relaxed">
              Seorang wanita luar biasa dengan hati yang mulia dan senyuman yang memikat.
              Melalui perjalanan hidupnya, dia menemukan cinta sejati.
            </p>
          </div>

          {/* Groom */}
          <div className="text-center">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-100 rounded-2xl blur-xl opacity-50 -z-10"></div>
              <div className="w-64 h-80 mx-auto bg-gradient-to-br from-blue-100 to-slate-100 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center">
                {couple.coverImage ? (
                  <Image
                    src={couple.coverImage}
                    alt={couple.groomName}
                    width={256}
                    height={320}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="text-6xl mb-2">🤴</div>
                    <p className="text-gray-600">Groom Photo</p>
                  </div>
                )}
              </div>
            </div>
            <h3 className="text-3xl font-serif text-gray-900 mb-2">{couple.groomName}</h3>
            <p className="text-gray-600 italic mb-4">Sang Raja</p>
            <p className="text-gray-700 leading-relaxed">
              Seorang pria berbakat dengan ketulusan dan dedikasi yang mendalam.
              Dia menemukan belahan jiwanya dan siap menjalani hidup bersama.
            </p>
          </div>
        </div>

        {/* Their story */}
        <div className="mt-16 p-8 md:p-12 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
          <h4 className="text-2xl font-serif text-gray-900 mb-4">Our Story</h4>
          <p className="text-gray-700 leading-relaxed">
            Pertemuan mereka adalah takdir yang indah. Dalam setiap momen bersama,
            mereka belajar bahwa cinta sejati adalah tentang saling mendukung, memahami,
            dan tumbuh bersama. Kini, saatnya mereka mengucapkan janji suci di hadapan
            orang-orang terkasih. Kami mengundang Anda menjadi bagian dari momen bersejarah ini.
          </p>
        </div>
      </div>
    </section>
  );
}
