'use client';

import { useEffect, useState } from 'react';
import { getGuestByCode, getCoupleById } from '@/lib/firebase-service';
import { Guest, Couple } from '@/lib/types';
import InvitationHero from '@/components/invitation/InvitationHero';
import Countdown from '@/components/invitation/Countdown';
import CoupleProfile from '@/components/invitation/CoupleProfile';
import EventDetails from '@/components/invitation/EventDetails';
import RSVPSection from '@/components/invitation/RSVPSection';
import BankAccounts from '@/components/invitation/BankAccounts';
import Wishes from '@/components/invitation/Wishes';
import Footer from '@/components/invitation/Footer';

export default function InvitationPage({ params }: { params: { code: string } }) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const guestData = await getGuestByCode(params.code);
        if (!guestData) {
          setLoading(false);
          return;
        }
        setGuest(guestData);

        const coupleData = await getCoupleById(guestData.coupleId);
        setCouple(coupleData || null);
      } catch (error) {
        console.error('Error loading invitation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.code]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!couple || !guest) return <div className="flex items-center justify-center h-screen">Undangan tidak ditemukan</div>;

  const bankAccounts = [
    {
      id: '1',
      bankName: 'BCA',
      accountName: `${couple.brideName} & ${couple.groomName}`,
      accountNumber: '1234567890',
      bankCode: 'BCA',
      color: 'blue' as const,
    },
    {
      id: '2',
      bankName: 'Mandiri',
      accountName: `${couple.brideName} & ${couple.groomName}`,
      accountNumber: '0987654321',
      bankCode: 'Mandiri',
      color: 'orange' as const,
    },
  ];

  return (
    <main className="bg-white">
      <InvitationHero couple={couple} guestName={guest.name} />
      <Countdown targetDate={couple.weddingDate} />
      <CoupleProfile couple={couple} />
      <EventDetails couple={couple} />
      <RSVPSection guest={guest} />
      <BankAccounts
        accounts={bankAccounts}
        coupleNames={`${couple.brideName} & ${couple.groomName}`}
      />
      <Wishes />
      <Footer coupleNames={`${couple.brideName} & ${couple.groomName}`} invitationCode={params.code} />
    </main>
  );
}
