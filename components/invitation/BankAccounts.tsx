'use client';

import { useState } from 'react';
import { FaClipboard, FaCopy, FaCheckCircle } from 'react-icons/fa';

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  color: 'blue' | 'orange' | 'purple' | 'green';
}

interface BankAccountsProps {
  accounts: BankAccount[];
  coupleNames: string;
}

export default function BankAccounts({ accounts, coupleNames }: BankAccountsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getBankGradient = (color: string) => {
    const gradients: Record<string, string> = {
      blue: 'from-blue-600 to-blue-400',
      orange: 'from-orange-600 to-orange-400',
      purple: 'from-purple-600 to-purple-400',
      green: 'from-green-600 to-green-400',
    };
    return gradients[color] || gradients.blue;
  };

  const getBankIcon = (bankName: string) => {
    const icons: Record<string, string> = {
      BCA: '🏦',
      Mandiri: '🏪',
      BNI: '🏢',
      BRI: '🏛️',
      CIMB: '🏤',
      OVO: '💳',
      GCash: '📱',
    };
    return icons[bankName] || '🏦';
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
            Hadiah Pernikahan
          </h2>
          <p className="text-gray-600 text-lg">
            Kami menghaturkan terima kasih atas dukungan dan hadiah berharga Anda
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mt-4"></div>
        </div>

        {/* Intro text */}
        <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-6 md:p-8 border border-white/50 shadow-md mb-8">
          <p className="text-gray-700 text-center leading-relaxed">
            Sebagai ungkapan kasih sayang, Anda dapat mengirimkan hadiah melalui transfer ke rekening berikut.
            <br />
            <span className="font-serif text-lg text-gray-900 mt-2 block">
              Atas Nama: {coupleNames}
            </span>
          </p>
        </div>

        {/* Bank Accounts */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {accounts.map((account, idx) => (
            <div key={account.id} className="group">
              {/* Card gradient background */}
              <div
                className={`bg-gradient-to-br ${getBankGradient(account.color)} rounded-2xl p-1 shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105`}
              >
                <div className="bg-white rounded-xl p-8 h-full">
                  {/* Bank header */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{getBankIcon(account.bankName)}</span>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Bank</p>
                      <p className="text-2xl font-bold text-gray-900">{account.bankName}</p>
                    </div>
                  </div>

                  {/* Account details */}
                  <div className="space-y-6">
                    {/* Account name */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                        Atas Nama
                      </p>
                      <p className="text-lg font-serif text-gray-900">
                        {account.accountName}
                      </p>
                    </div>

                    {/* Account number */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                        Nomor Rekening
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <p className="text-xl md:text-2xl font-mono font-bold text-gray-900 tracking-wider">
                            {account.accountNumber}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(account.accountNumber, account.id)
                          }
                          className={`p-3 rounded-lg transition-all ${
                            copiedId === account.id
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title="Salin nomor rekening"
                        >
                          {copiedId === account.id ? (
                            <FaCheckCircle size={20} />
                          ) : (
                            <FaCopy size={20} />
                          )}
                        </button>
                      </div>
                      {copiedId === account.id && (
                        <p className="text-xs text-green-600 mt-2">✓ Disalin ke clipboard</p>
                      )}
                    </div>

                    {/* Quick action buttons */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            copyToClipboard(account.accountNumber, account.id)
                          }
                          className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <FaClipboard size={14} /> Salin Nomor
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Decorative element */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center">
                      {account.bankName} • {account.bankCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card number */}
              <p className="text-xs text-gray-500 mt-2 text-center">
                Rekening {idx + 1} dari {accounts.length}
              </p>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="backdrop-blur-sm bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200">
          <div className="space-y-4">
            <h3 className="text-xl font-serif text-gray-900 flex items-center gap-2">
              <span className="text-2xl">💝</span> Informasi Tambahan
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold">✓</span>
                <span>Pastikan nama penerima sudah benar sebelum melakukan transfer</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold">✓</span>
                <span>
                  Konfirmasi pemberian hadiah dapat dilakukan melalui WhatsApp atau email
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold">✓</span>
                <span>Hadiah dalam bentuk uang dapat langsung ditransfer tanpa minimum</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 font-bold">✓</span>
                <span>
                  Kami berterima kasih atas setiap bentuk dukungan dan doa dari Anda
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Thank you message */}
        <div className="text-center mt-12">
          <p className="text-gray-600 italic">
            Terima kasih telah menjadi bagian dari perjalanan bahagia kami 💕
          </p>
        </div>
      </div>
    </section>
  );
}
