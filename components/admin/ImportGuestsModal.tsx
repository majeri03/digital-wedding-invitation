'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { addGuests, generateInvitationCode } from '@/lib/firebase-service';
import { Guest } from '@/lib/types';

interface ImportGuestsModalProps {
  coupleId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportGuestsModal({
  coupleId,
  onClose,
  onSuccess,
}: ImportGuestsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Parse CSV for preview
    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        setPreview(results.data.filter((row: any) => row.name).slice(0, 5));
      },
    });
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    try {
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          const guests: Guest[] = results.data
            .filter((row: any) => row.name)
            .map((row: any) => ({
              id: `${Date.now()}-${Math.random()}`,
              coupleId,
              name: row.name,
              email: row.email,
              phone: row.phone,
              invitationCode: generateInvitationCode(),
              status: 'pending',
              companion: parseInt(row.companion) || 0,
              specialRequests: row.specialRequests,
              createdAt: Date.now(),
            }));

          await addGuests(coupleId, guests);
          onSuccess();
        },
      });
    } catch (error) {
      console.error('Error importing guests:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Import Daftar Tamu</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Upload CSV (nama, email, phone, companion, specialRequests)
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {preview.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="bg-gray-50 rounded p-3 max-h-40 overflow-y-auto">
              {preview.map((row, i) => (
                <p key={i} className="text-sm text-gray-600">{row.name}</p>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Batal
          </button>
          <button
            onClick={handleImport}
            disabled={!file || loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Loading...' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
}
