'use client';

import { Couple } from '@/lib/types';
import { FaMapMarkerAlt, FaClock, FaPhone } from 'react-icons/fa';

interface EventDetailsProps {
  couple: Couple;
}

export default function EventDetails({ couple }: EventDetailsProps) {
  const weddingDate = new Date(couple.weddingDate);

  const events = [
    {
      name: 'Upacara Pernikahan',
      time: '10:00 - 11:30 WIB',
      icon: '💍',
    },
    {
      name: 'Resepsi & Makan Bersama',
      time: '12:00 - 17:00 WIB',
      icon: '🍽️',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-16">
          Detail Acara
        </h2>

        {/* Date */}
        <div className="text-center mb-12">
          <p className="text-gray-600 text-sm uppercase tracking-widest mb-2">Tanggal Istimewa</p>
          <p className="text-5xl md:text-6xl font-serif text-gray-900 mb-2">
            {weddingDate.getDate()}
          </p>
          <p className="text-2xl text-gray-700">
            {weddingDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </p>
          <p className="text-gray-600 mt-2">
            {weddingDate.toLocaleDateString('id-ID', { weekday: 'long' })}
          </p>
        </div>

        {/* Events Timeline */}
        <div className="space-y-6 mb-12">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="backdrop-blur-sm bg-white/60 rounded-xl p-6 md:p-8 border border-white/50 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{event.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-serif text-gray-900 mb-2">{event.name}</h3>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-yellow-500" />
                    {event.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="backdrop-blur-sm bg-white/60 rounded-xl p-8 border border-white/50 shadow-lg mb-12">
          <div className="flex items-start gap-4 mb-6">
            <FaMapMarkerAlt className="text-2xl text-yellow-500 mt-1" />
            <div className="flex-1">
              <h3 className="text-2xl font-serif text-gray-900 mb-2">Lokasi Acara</h3>
              <p className="text-gray-700 text-lg">{couple.location}</p>
            </div>
          </div>

          {/* Google Maps placeholder */}
          <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.5438!2d107.6062!3d-6.9147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6b6b6b6b6b7%3A0x1234567890!2s${encodeURIComponent(couple.location)}!5e0!3m2!1sid!2sid!4v1234567890`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/60 rounded-xl p-6 border border-white/50">
            <p className="text-gray-600 text-sm uppercase tracking-widest mb-2">Kontak Penyelenggara</p>
            <div className="flex items-center gap-2 text-gray-900">
              <FaPhone className="text-yellow-500" />
              <span>+62 XXX XXXX XXXX</span>
            </div>
          </div>
          <div className="backdrop-blur-sm bg-white/60 rounded-xl p-6 border border-white/50">
            <p className="text-gray-600 text-sm uppercase tracking-widest mb-2">Dress Code</p>
            <p className="text-gray-900">Formal • Royal Attire / Kebaya</p>
          </div>
        </div>
      </div>
    </section>
  );
}
