'use client';

import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: number;
}

interface WishesProps {
  wishes?: Wish[];
}

export default function Wishes({ wishes = [] }: WishesProps) {
  const [newWish, setNewWish] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.trim()) return;

    setLoading(true);
    try {
      // TODO: Submit to Firebase
      console.log('Submitting wish:', newWish);
      setNewWish('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-4">
          Ucapan & Doa
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Bagikan momen bahagia dan doa terbaik untuk pasangan pengantin
        </p>

        {/* Wish form */}
        <form onSubmit={handleSubmitWish} className="mb-12">
          <div className="backdrop-blur-sm bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-yellow-200">
            <textarea
              value={newWish}
              onChange={(e) => setNewWish(e.target.value)}
              placeholder="Tulis ucapan Anda di sini..."
              className="w-full p-4 rounded-lg border border-yellow-200 bg-white/80 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 outline-none resize-none mb-4"
              rows={4}
            />
            <button
              type="submit"
              disabled={loading || !newWish.trim()}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaHeart /> Kirim Ucapan
            </button>
          </div>
        </form>

        {/* Wishes list */}
        <div className="space-y-4">
          {wishes.length > 0 ? (
            wishes.map((wish) => (
              <div
                key={wish.id}
                className="backdrop-blur-sm bg-white/60 rounded-xl p-6 border border-white/50 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <FaHeart className="text-yellow-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-serif text-gray-900 font-semibold">{wish.name}</p>
                    <p className="text-gray-700 mt-2">{wish.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(wish.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 py-8">Belum ada ucapan. Jadilah yang pertama!</p>
          )}
        </div>
      </div>
    </section>
  );
}
