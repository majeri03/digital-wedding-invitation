'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { getCouplesByAdmin, getInvitationStats } from '@/lib/firebase-service';
import { Couple, InvitationStats } from '@/lib/types';
import CoupleCard from '@/components/admin/CoupleCard';
import CreateCoupleModal from '@/components/admin/CreateCoupleModal';
import ImportGuestsModal from '@/components/admin/ImportGuestsModal';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [couples, setCouples] = useState<Couple[]>([]);
  const [stats, setStats] = useState<Record<string, InvitationStats>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadCouples();
  }, [user]);

  const loadCouples = async () => {
    if (!user?.uid) return;
    try {
      const data = await getCouplesByAdmin(user.uid);
      setCouples(data);

      // Load stats for each couple
      const statsData: Record<string, InvitationStats> = {};
      for (const couple of data) {
        statsData[couple.id] = await getInvitationStats(couple.id);
      }
      setStats(statsData);
    } catch (error) {
      console.error('Error loading couples:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Buat Undangan Baru
          </button>
        </div>

        {/* Couples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {couples.map((couple) => (
            <CoupleCard
              key={couple.id}
              couple={couple}
              stats={stats[couple.id]}
              onImport={() => setShowImportModal(couple.id)}
              onRefresh={loadCouples}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateCoupleModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadCouples();
          }}
        />
      )}

      {showImportModal && (
        <ImportGuestsModal
          coupleId={showImportModal}
          onClose={() => setShowImportModal(null)}
          onSuccess={() => {
            setShowImportModal(null);
            loadCouples();
          }}
        />
      )}
    </div>
  );
}
