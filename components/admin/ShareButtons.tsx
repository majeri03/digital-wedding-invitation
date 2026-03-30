'use client';

import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

interface ShareButtonsProps {
  guestName: string;
  invitationCode: string;
  coupleNames: string;
}

export default function ShareButtons({
  guestName,
  invitationCode,
  coupleNames,
}: ShareButtonsProps) {
  const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invitation/${invitationCode}`;
  
  const whatsappMessage = encodeURIComponent(
    `Halo ${guestName},\n\nKami dengan senang hati mengundang Anda ke pernikahan ${coupleNames}.\n\nBuka undangan Anda di sini: ${invitationUrl}\n\nTerima kasih! 💕`
  );

  const instagramCaption = encodeURIComponent(
    `✨ Jangan lewatkan pernikahan ${coupleNames}! ✨\n\nBuka undangan Anda: ${invitationUrl}\n\n#WeddingInvitation #RoyalWedding`
  );

  return (
    <div className="flex gap-2">
      <a
        href={`https://wa.me/?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      >
        <FaWhatsapp /> WhatsApp
      </a>
      <a
        href={`https://www.instagram.com/share?url=${invitationUrl}&quote=${instagramCaption}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
      >
        <FaInstagram /> Story
      </a>
    </div>
  );
}
