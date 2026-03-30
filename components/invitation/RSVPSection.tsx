'use client';

import { useState } from 'react';
import { Guest } from '@/lib/types';
import { updateGuestStatus } from '@/lib/firebase-service';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface RSVPSectionProps {
  guest: Guest;
  onSuccess?: () => void;
}

export default function RSVPSection({ guest, onSuccess }: RSVPSectionProps) {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'declined'>(guest.status);
  const [loading, setLoading] = useState(false);
  const [companion, setCompanion] = useState(guest.companion || 0);

  const handleResponse = async (newStatus: 'accepted' | 'declined') => {
    setLoading(true);
    try {
      await updateGuestStatus(guest.id, newStatus);
      setStatus(newStatus);
      onSuccess?.();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (status === 'accepted') return 'green';
    if (status === 'declined') return 'red';
    return 'gray';
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-4">
          Konfirmasi Kehadiran
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Silakan konfirmasi kehadiran Anda sebelum {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID')}
        </p>

        {/* Guest info card */}
        <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-8 border border-white/50 shadow-lg mb-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif text-gray-900">{guest.name}</h3>
            {guest.email && (
              <p className="text-gray-600 text-sm mt-2">{guest.email}</p>
            )}
          </div>

          {/* Companion selection */}
          <div className="mb-8">
            <label className="block text-gray-700 font-serif text-lg mb-3">
              Berapa banyak yang akan hadir? (termasuk Anda)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setCompanion(num)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    companion === num
                      ? `border-yellow-500 bg-yellow-50 text-yellow-900`
                      : `border-gray-200 bg-white text-gray-700 hover:border-gray-300`
                  }`}
                  disabled={status !== 'pending'}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* RSVP Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => handleResponse('accepted')}
              disabled={loading}
              className={`flex-1 py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                status === 'accepted'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-300 hover:bg-gray-400 disabled:opacity-50'
              }`}
            >
              <FaCheck /> Hadir
            </button>
            <button
              onClick={() => handleResponse('declined')}
              disabled={loading}
              className={`flex-1 py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                status === 'declined'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-300 hover:bg-gray-400 disabled:opacity-50'
              }`}
            >
              <FaTimes /> Tidak Hadir
            </button>
          </div>

          {/* Status message */}
          {status !== 'pending' && (
            <div
              className={`p-4 rounded-lg text-center font-semibold ${
                status === 'accepted'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {status === 'accepted'
                ? `✨ Terima kasih! Kami tunggu kehadiran Anda (${companion} orang)`
                : '🙏 Terima kasih atas informasinya'}
            </div>
          )}
        </div>

        {/* Special requests */}
        <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-8 border border-white/50 shadow-lg">
          <label className="block text-gray-700 font-serif text-lg mb-3">
            Ada permintaan khusus?
          </label>
          <textarea
            defaultValue={guest.specialRequests || ''}
            placeholder="Contoh: vegetarian, alergi, dll"
            className="w-full p-4 rounded-lg border border-gray-200 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none resize-none"
            rows={3}
          />
        </div>
      </div>
    </section>
  );
}
