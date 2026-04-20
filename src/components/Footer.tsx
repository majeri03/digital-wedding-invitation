export default function Footer({ data }: { data?: any }) {
  const names = data ? `${data.groomName.split(' ')[0]} & ${data.brideName.split(' ')[0]}` : "Andi & Tenri";
  return (
    <footer className="bg-brand-maroon text-brand-ivory py-12 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/bg-pattern.webp')] bg-cover opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-heading text-brand-gold mb-4">{names}</h2>
        <p className="text-sm opacity-80 mb-8">Terima kasih atas doa dan restu yang telah diberikan.</p>
        <p className="text-xs opacity-50">&copy; 2026 {names} Wedding. All rights reserved.</p>
        <p className="text-xs opacity-50 mt-2">Digital Invitation by <span className="text-brand-gold font-bold">Premium Invite</span></p>
      </div>
    </footer>
  );
}
