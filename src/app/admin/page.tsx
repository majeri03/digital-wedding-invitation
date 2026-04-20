"use client";

import { useState, useEffect } from "react";
import { Users, Settings, Heart, CalendarHeart, Trash2, MapPin, Key, User as UserIcon, LogOut, Plus, Search, ChevronRight, ArrowLeft, Image as ImageIcon, CreditCard, Link as LinkIcon, Download, LayoutList } from "lucide-react";
import { auth, db, storage } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, getDocs, where, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Super Admin State
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Client Data State
  const [weddingData, setWeddingData] = useState<any>({});
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [wishes, setWishes] = useState<any[]>([]);
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestSide, setNewGuestSide] = useState("pria");
  const [generatedLink, setGeneratedLink] = useState("");

  // UI States
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClientSlug, setNewClientSlug] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch All Clients (Filtered by User)
  useEffect(() => {
    if (!user) return;
    
    // Check if Super Admin (set your email in .env.local as NEXT_PUBLIC_ADMIN_EMAIL)
    const isAdmin = process.env.NEXT_PUBLIC_ADMIN_EMAIL === user.email;
    
    const clientsRef = collection(db, "clients");
    const q = isAdmin ? clientsRef : query(clientsRef, where("ownerEmail", "==", user.email));

    const unsub = onSnapshot(q, (snapshot) => {
      const data: any[] = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setClients(data);
    });
    return () => unsub();
  }, [user]);

  // Fetch Selected Client Data
  useEffect(() => {
    if (!selectedClient) return;
    
    // Listen to specific client doc
    const unsubClient = onSnapshot(doc(db, "clients", selectedClient.id), (docSnap) => {
      if(docSnap.exists()) {
        setWeddingData(docSnap.data());
      }
    });

    // Listen to RSVP for this client
    const qRsvp = query(collection(db, "rsvp"), where("clientSlug", "==", selectedClient.id));
    const unsubRsvp = onSnapshot(qRsvp, (snapshot) => {
      const data: any[] = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setRsvps(data);
    });

    // Listen to Wishes for this client
    const qWishes = query(collection(db, "wishes"), where("clientSlug", "==", selectedClient.id));
    const unsubWishes = onSnapshot(qWishes, (snapshot) => {
      const data: any[] = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setWishes(data);
    });

    return () => {
      unsubClient();
      unsubRsvp();
      unsubWishes();
    };
  }, [selectedClient]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Login gagal. Periksa email dan password Anda.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      alert("Login dengan Google gagal.");
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newClientSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if(!slug) return alert("Slug tidak valid");
    
    const newClientData = {
      slug: slug,
      clientName: newClientName,
      createdAt: serverTimestamp(),
      userId: user?.uid, // ID pembuat (Admin)
      ownerEmail: newClientEmail || user?.email, // Email Klien (Agar klien bisa login via Google)
      groomName: "Nama Pria",
      brideName: "Nama Wanita",
      groomParents: "Orang Tua Pria",
      brideParents: "Orang Tua Wanita",
      weddingDate: "2026-12-25",
      akadTime: "09:00",
      akadLocation: "Lokasi Akad",
      priaTime: "11:00",
      priaLocation: "Lokasi Resepsi Pria",
      wanitaTime: "11:00",
      wanitaLocation: "Lokasi Resepsi Wanita",
      gifts: [],
      theme: "premium-bugis",
      sections: {
        hero: true,
        couple: true,
        loveStory: true,
        schedule: true,
        gallery: true,
        rsvp: true,
        wishes: true,
        gift: true,
        maps: true,
        thankYou: true
      }
    };

    try {
      await setDoc(doc(db, "clients", slug), newClientData);
      setShowAddClient(false);
      setNewClientSlug("");
      setNewClientName("");
      setNewClientEmail("");
    } catch (error) {
      alert("Gagal membuat client");
    }
  };

  const handleDeleteClient = async (slug: string) => {
    if(confirm(`Hapus permanen klien ${slug}? Semua data pengaturan akan hilang!`)) {
      await deleteDoc(doc(db, "clients", slug));
      if(selectedClient?.id === slug) setSelectedClient(null);
    }
  };

  const handleSaveWeddingData = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedClient) return;
    try {
      await setDoc(doc(db, "clients", selectedClient.id), weddingData, { merge: true });
      alert("Data berhasil disimpan!");
    } catch(err) {
      alert("Gagal menyimpan data.");
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClient) return;
    
    setIsUploading(true);
    try {
      // 1. Storage Upload
      const storageRef = ref(storage, `clients/${selectedClient.id}/${fieldName}_${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on('state_changed', 
        (snapshot) => {},
        (error) => {
          console.error("Upload error", error);
          alert("Gagal mengupload gambar. Pastikan pengaturan Storage Firebase sudah benar.");
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setWeddingData({ ...weddingData, [fieldName]: downloadURL });
          setIsUploading(false);
        }
      );
    } catch(err) {
      console.error(err);
      alert("Terjadi kesalahan.");
      setIsUploading(false);
    }
  };

  const handleGenerateLink = () => {
    if(!newGuestName) return;
    const formattedName = encodeURIComponent(newGuestName.trim().replace(/\s+/g, '-'));
    const url = `${window.location.origin}/invite/${selectedClient.id}?side=${newGuestSide}&to=${formattedName}`;
    setGeneratedLink(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("Link disalin!");
  };

  // Glassmorphism Common Styles
  const glassPanel = "bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-3xl";
  const glassInput = "w-full px-5 py-4 bg-white/50 backdrop-blur-md border border-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:bg-white/80 transition-all text-gray-800 placeholder-gray-400 shadow-inner";

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F5F0] to-[#EAE0D5]">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A0B10] to-[#3A0B1A] px-4 relative overflow-hidden">
        {/* Animated Background Ornaments */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/10 backdrop-blur-2xl p-10 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-md w-full border border-white/20 relative z-10">
          <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] mb-2 font-heading tracking-wider">PREMIUM SAAS</h1>
          <p className="text-center text-white/60 mb-10 text-sm tracking-widest uppercase">Admin Login</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-4 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-black/20 text-white placeholder-white/30 backdrop-blur-sm transition-all" placeholder="admin@wedding.com" />
              </div>
            </div>
            <div>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full pl-12 pr-4 py-4 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-black/20 text-white placeholder-white/30 backdrop-blur-sm transition-all" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8912E] text-[#1A0B10] font-bold rounded-2xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] mt-8 text-lg uppercase tracking-widest">Sign In</button>
            
            <div className="relative mt-6 mb-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/50 backdrop-blur-2xl">atau</span>
              </div>
            </div>

            <button type="button" onClick={handleGoogleLogin} className="w-full py-4 bg-white/90 text-gray-800 font-bold rounded-2xl hover:bg-white transition-all shadow-lg flex items-center justify-center gap-3 text-base">
              <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Login dengan Google
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ==== SUPER ADMIN DASHBOARD ====
  if (!selectedClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4F1EA] via-[#EAE5D9] to-[#DFD6C8] font-sans p-8 relative overflow-hidden">
        {/* Glass Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <header className="flex justify-between items-center mb-12 bg-white/30 backdrop-blur-lg px-8 py-4 rounded-3xl border border-white/60 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-[#6B0F1A] font-heading tracking-wide">SaaS Master Dashboard</h1>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Multi-Tenant Management</p>
            </div>
            <button onClick={() => signOut(auth)} className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-600 font-bold rounded-full hover:bg-red-500/20 transition-all text-sm">
              <LogOut size={16} /> Logout
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className={`md:col-span-1 flex flex-col gap-6`}>
              <div className={`${glassPanel} p-6 flex flex-col items-center text-center`}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6B0F1A] to-[#A01626] flex items-center justify-center text-[#D4AF37] mb-4 shadow-xl">
                  <Users size={32} />
                </div>
                <h3 className="text-4xl font-bold text-gray-800">{clients.length}</h3>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-1">Total Klien Aktif</p>
              </div>
              
              <button onClick={() => setShowAddClient(!showAddClient)} className={`w-full py-5 rounded-3xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-white bg-gradient-to-r from-[#6B0F1A] to-[#8E1422] hover:shadow-xl hover:-translate-y-1`}>
                <Plus size={20} /> Tambah Klien Baru
              </button>

              <AnimatePresence>
                {showAddClient && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <form onSubmit={handleCreateClient} className={`${glassPanel} p-6 mt-2 space-y-4`}>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Nama Pasangan</label>
                        <input type="text" value={newClientName} onChange={e=>setNewClientName(e.target.value)} placeholder="Contoh: Andi & Tenri" className={glassInput} required />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">URL Slug</label>
                        <input type="text" value={newClientSlug} onChange={e=>setNewClientSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} placeholder="andi-tenri" className={glassInput} required />
                        <p className="text-[10px] text-gray-400 mt-2">Link: /invite/<span className="text-[#6B0F1A] font-bold">{newClientSlug || 'slug'}</span></p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Email Klien (Akun Login)</label>
                        <input type="email" value={newClientEmail} onChange={e=>setNewClientEmail(e.target.value)} placeholder="email.klien@gmail.com" className={glassInput} required />
                        <p className="text-[10px] text-gray-400 mt-2">Klien akan login menggunakan email ini via Google Login.</p>
                      </div>
                      <button type="submit" className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:opacity-90">Buat Undangan</button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={`md:col-span-3 ${glassPanel} p-8`}>
              <div className="flex justify-between items-center mb-6 border-b border-white/50 pb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><DatabaseIcon /> Database Klien</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="Cari klien..." className="pl-10 pr-4 py-2 bg-white/40 border border-white/60 rounded-full text-sm focus:outline-none focus:bg-white/80 w-64" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clients.map(client => (
                  <motion.div whileHover={{ scale: 1.02 }} key={client.id} className="bg-white/50 border border-white/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex justify-between items-center group cursor-pointer" onClick={() => setSelectedClient(client)}>
                    <div>
                      <h3 className="font-bold text-lg text-[#6B0F1A]">{client.clientName || client.slug}</h3>
                      <p className="text-xs text-gray-500 font-mono bg-white/50 inline-block px-2 py-1 rounded mt-1 border border-gray-100">/invite/{client.slug}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }} className="p-2 text-red-400 hover:text-red-600 bg-white/50 rounded-full hover:bg-red-50 transition opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                      <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </motion.div>
                ))}
                {clients.length === 0 && <div className="col-span-2 text-center py-12 text-gray-500 italic">Belum ada klien yang terdaftar.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==== INDIVIDUAL CLIENT MANAGEMENT DASHBOARD ====
  const hadirCount = rsvps.filter(r => r.status === "hadir").reduce((sum, r) => sum + Number(r.count || 1), 0);
  const clientTabs = [
    { id: "overview", label: "Overview", icon: <Settings size={18} /> },
    { id: "wedding", label: "Data Acara", icon: <CalendarHeart size={18} /> },
    { id: "guests", label: "Link & Tamu", icon: <LinkIcon size={18} /> },
    { id: "rsvp", label: "Daftar Hadir", icon: <Users size={18} /> },
    { id: "wishes", label: "Ucapan", icon: <Heart size={18} /> },
    { id: "gifts", label: "Amplop Digital", icon: <CreditCard size={18} /> },
    { id: "theme", label: "Tema & Desain", icon: <ImageIcon size={18} /> },
    { id: "sections", label: "Tampilan Menu", icon: <LayoutList size={18} /> },
  ];

  const availableThemes = [
    { id: "premium-bugis", name: "Premium Bugis", color: "from-[#6B0F1A] to-[#A01626]", desc: "Desain mewah khas adat Bugis dengan ornamen emas." },
    { id: "elegant-gold", name: "Elegant Gold", color: "from-[#D4AF37] to-[#B8912E]", desc: "Nuansa emas elegan yang cocok untuk pernikahan internasional." },
    { id: "minimalist-white", name: "Minimalist White", color: "from-[#F8F5F0] to-[#EAE5D9]", desc: "Bersih, modern, dan minimalis dengan sentuhan soft." },
    { id: "floral-garden", name: "Floral Garden", color: "from-[#4A5D23] to-[#2E3B16]", desc: "Tema natural dengan aksen dedaunan hijau dan bunga." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F0] to-[#EAE5D9] flex font-sans overflow-hidden">
      
      {/* Sidebar Kiri - Glassmorphism */}
      <div className="w-72 bg-white/40 backdrop-blur-xl border-r border-white/60 flex flex-col h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-20">
        <div className="p-6 border-b border-white/40">
          <button onClick={() => setSelectedClient(null)} className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-[#6B0F1A] transition-colors mb-6">
            <ArrowLeft size={14} /> Kembali ke Master
          </button>
          <div className="bg-white/60 p-4 rounded-2xl border border-white/80 shadow-sm">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Mengelola Klien</p>
            <h1 className="text-xl font-bold text-[#6B0F1A] font-heading">{selectedClient.clientName || selectedClient.slug}</h1>
            <p className="text-xs font-mono text-gray-500 mt-1 truncate">/{selectedClient.slug}</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {clientTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-semibold ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#6B0F1A] to-[#8E1422] text-white shadow-lg shadow-[#6B0F1A]/20"
                  : "text-gray-600 hover:bg-white/50 hover:text-[#6B0F1A]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Konten Tengah */}
      <div className={`flex-1 overflow-y-auto h-screen relative scroll-smooth ${(activeTab === "wedding" || activeTab === "theme" || activeTab === "sections") ? "lg:flex-none lg:w-[60%]" : ""}`}>
        {/* Decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-white/30 rounded-full blur-[100px] pointer-events-none z-0"></div>
        
        <div className="p-10 relative z-10 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            
            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-8 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 font-heading">Analytics Dashboard</h2>
                    <p className="text-gray-500 mt-1">Statistik undangan real-time.</p>
                  </div>
                  <a href={`/invite/${selectedClient.slug}`} target="_blank" className="px-6 py-2.5 bg-white/60 backdrop-blur-sm border border-white rounded-full text-sm font-bold text-[#6B0F1A] shadow-sm hover:bg-white transition flex items-center gap-2">
                    <LinkIcon size={16} /> Pratinjau Undangan
                  </a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className={`${glassPanel} p-6 relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-[#6B0F1A] group-hover:scale-110 transition-transform duration-500"><Users size={80} /></div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Total RSVP Masuk</p>
                    <p className="text-5xl font-bold text-[#6B0F1A]">{rsvps.length}</p>
                  </div>
                  <div className={`${glassPanel} p-6 relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-green-600 group-hover:scale-110 transition-transform duration-500"><Users size={80} /></div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Total Hadir (Orang)</p>
                    <p className="text-5xl font-bold text-green-600">{hadirCount}</p>
                  </div>
                  <div className={`${glassPanel} p-6 relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500"><Heart size={80} /></div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Total Ucapan</p>
                    <p className="text-5xl font-bold text-[#D4AF37]">{wishes.length}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: WEDDING DATA */}
            {activeTab === "wedding" && (
              <motion.div key="wedding" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 font-heading">Data & Jadwal Pernikahan</h2>
                  <p className="text-gray-500 mt-1">Lengkapi informasi mempelai, akad, dan resepsi di sini.</p>
                </div>

                <form onSubmit={handleSaveWeddingData} className="space-y-8 pb-20">
                  
                  {/* Mempelai */}
                  <div className={`${glassPanel} overflow-hidden`}>
                    <div className="bg-white/40 px-8 py-5 border-b border-white/60">
                      <h3 className="font-bold text-lg text-[#6B0F1A] flex items-center gap-2"><Heart size={20} /> Data Pasangan Pengantin</h3>
                    </div>
                    <div className="p-8 grid grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 text-sm uppercase tracking-wider">Mempelai Pria</h4>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Panggilan</label>
                          <input type="text" value={weddingData.groomName || ""} onChange={e => setWeddingData({...weddingData, groomName: e.target.value})} className={glassInput} required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Orang Tua</label>
                          <textarea value={weddingData.groomParents || ""} onChange={e => setWeddingData({...weddingData, groomParents: e.target.value})} className={glassInput} rows={2} required />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 text-sm uppercase tracking-wider">Mempelai Wanita</h4>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Panggilan</label>
                          <input type="text" value={weddingData.brideName || ""} onChange={e => setWeddingData({...weddingData, brideName: e.target.value})} className={glassInput} required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Orang Tua</label>
                          <textarea value={weddingData.brideParents || ""} onChange={e => setWeddingData({...weddingData, brideParents: e.target.value})} className={glassInput} rows={2} required />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Akad */}
                  <div className={`${glassPanel} overflow-hidden`}>
                    <div className="bg-white/40 px-8 py-5 border-b border-white/60">
                      <h3 className="font-bold text-lg text-[#6B0F1A] flex items-center gap-2"><CalendarHeart size={20} /> Jadwal Akad Nikah</h3>
                    </div>
                    <div className="p-8 grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tanggal Akad</label>
                          <input type="date" value={weddingData.weddingDate || ""} onChange={e => setWeddingData({...weddingData, weddingDate: e.target.value})} className={glassInput} required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Waktu Akad</label>
                          <input type="time" value={weddingData.akadTime || ""} onChange={e => setWeddingData({...weddingData, akadTime: e.target.value})} className={glassInput} required />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lokasi / Gedung</label>
                          <input type="text" value={weddingData.akadLocation || ""} onChange={e => setWeddingData({...weddingData, akadLocation: e.target.value})} className={glassInput} required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Google Maps Iframe</label>
                          <input type="text" placeholder="<iframe src=...>" value={weddingData.akadMaps || ""} onChange={e => setWeddingData({...weddingData, akadMaps: e.target.value})} className={glassInput} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Teks Tambahan */}
                  <div className={`${glassPanel} overflow-hidden`}>
                    <div className="bg-white/40 px-8 py-5 border-b border-white/60">
                      <h3 className="font-bold text-lg text-[#6B0F1A] flex items-center gap-2"><LayoutList size={20} /> Teks Kutipan & Penutup</h3>
                    </div>
                    <div className="p-8 grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 text-sm uppercase tracking-wider">Bagian Intro (Salam)</h4>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Salam Pembuka</label>
                          <input type="text" value={weddingData.introGreeting || ""} onChange={e => setWeddingData({...weddingData, introGreeting: e.target.value})} className={glassInput} placeholder="Assalamu'alaikum Wr. Wb." />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Teks Pengantar</label>
                          <textarea value={weddingData.introText || ""} onChange={e => setWeddingData({...weddingData, introText: e.target.value})} className={glassInput} rows={3} placeholder="Dengan memohon rahmat Allah..." />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 text-sm uppercase tracking-wider">Bagian Ayat / Doa</h4>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kutipan Ayat/Doa</label>
                          <textarea value={weddingData.heroQuote || ""} onChange={e => setWeddingData({...weddingData, heroQuote: e.target.value})} className={glassInput} rows={3} placeholder='"Dan di antara tanda-tanda kekuasaan-Nya..."' />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sumber Kutipan</label>
                          <input type="text" value={weddingData.heroQuoteSource || ""} onChange={e => setWeddingData({...weddingData, heroQuoteSource: e.target.value})} className={glassInput} placeholder="(QS. Ar-Rum: 21)" />
                        </div>
                      </div>
                      <div className="space-y-4 col-span-2 md:col-span-1">
                        <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 text-sm uppercase tracking-wider">Bagian Penutup</h4>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Judul Penutup</label>
                          <input type="text" value={weddingData.thankYouTitle || ""} onChange={e => setWeddingData({...weddingData, thankYouTitle: e.target.value})} className={glassInput} placeholder="Terima Kasih" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Teks Penutup</label>
                          <textarea value={weddingData.thankYouText || ""} onChange={e => setWeddingData({...weddingData, thankYouText: e.target.value})} className={glassInput} rows={4} placeholder="Merupakan suatu kehormatan..." />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Galeri Foto */}
                  <div className={`${glassPanel} overflow-hidden`}>
                    <div className="bg-white/40 px-8 py-5 border-b border-white/60">
                      <h3 className="font-bold text-lg text-[#6B0F1A] flex items-center gap-2"><ImageIcon size={20} /> Galeri Foto Pre-Wedding</h3>
                    </div>
                    <div className="p-8 space-y-4">
                      <p className="text-xs text-gray-500 mb-4">Masukkan URL gambar untuk galeri (pisahkan dengan koma), atau biarkan kosong untuk menggunakan gambar bawaan.</p>
                      <div>
                        <textarea 
                          value={weddingData.galleryImages?.join(',\n') || ""} 
                          onChange={e => {
                            const urls = e.target.value.split(',').map(u => u.trim()).filter(Boolean);
                            setWeddingData({...weddingData, galleryImages: urls});
                          }} 
                          className={glassInput} 
                          rows={6} 
                          placeholder="https://contoh.com/foto1.jpg,&#10;https://contoh.com/foto2.jpg" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resepsi Terpisah */}
                  <div className={`${glassPanel} overflow-hidden`}>
                    <div className="bg-white/40 px-8 py-5 border-b border-white/60">
                      <h3 className="font-bold text-lg text-[#6B0F1A] flex items-center gap-2"><MapPin size={20} /> Jadwal Resepsi (Dukungan Link Terpisah)</h3>
                    </div>
                    <div className="p-8 grid grid-cols-2 gap-8">
                      <div className="space-y-4 bg-blue-50/50 border border-blue-100/50 p-6 rounded-3xl">
                        <h4 className="font-bold text-blue-900 border-b border-blue-200 pb-2 mb-4">Resepsi Pihak Pria</h4>
                        <div>
                          <label className="block text-xs font-bold text-blue-800/60 uppercase tracking-wider mb-2">Waktu Resepsi</label>
                          <input type="time" value={weddingData.priaTime || ""} onChange={e => setWeddingData({...weddingData, priaTime: e.target.value})} className={glassInput} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-blue-800/60 uppercase tracking-wider mb-2">Lokasi / Gedung</label>
                          <input type="text" value={weddingData.priaLocation || ""} onChange={e => setWeddingData({...weddingData, priaLocation: e.target.value})} className={glassInput} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-blue-800/60 uppercase tracking-wider mb-2">Maps Iframe</label>
                          <input type="text" placeholder="<iframe src=...>" value={weddingData.priaMaps || ""} onChange={e => setWeddingData({...weddingData, priaMaps: e.target.value})} className={glassInput} />
                        </div>
                      </div>
                      <div className="space-y-4 bg-pink-50/50 border border-pink-100/50 p-6 rounded-3xl">
                        <h4 className="font-bold text-pink-900 border-b border-pink-200 pb-2 mb-4">Resepsi Pihak Wanita</h4>
                        <div>
                          <label className="block text-xs font-bold text-pink-800/60 uppercase tracking-wider mb-2">Waktu Resepsi</label>
                          <input type="time" value={weddingData.wanitaTime || ""} onChange={e => setWeddingData({...weddingData, wanitaTime: e.target.value})} className={glassInput} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-pink-800/60 uppercase tracking-wider mb-2">Lokasi / Gedung</label>
                          <input type="text" value={weddingData.wanitaLocation || ""} onChange={e => setWeddingData({...weddingData, wanitaLocation: e.target.value})} className={glassInput} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-pink-800/60 uppercase tracking-wider mb-2">Maps Iframe</label>
                          <input type="text" placeholder="<iframe src=...>" value={weddingData.wanitaMaps || ""} onChange={e => setWeddingData({...weddingData, wanitaMaps: e.target.value})} className={glassInput} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-10 z-50 flex justify-end">
                    <button type="submit" className="px-10 py-4 bg-gradient-to-r from-[#6B0F1A] to-[#8E1422] text-[#D4AF37] font-bold rounded-full hover:shadow-[0_10px_30px_rgba(107,15,26,0.3)] transition-all flex items-center gap-2 transform hover:-translate-y-1">
                      <Settings size={20} /> Simpan Seluruh Perubahan
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* TAB: LINK GENERATOR */}
            {activeTab === "guests" && (
              <motion.div key="guests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 font-heading">Link Generator</h2>
                  <p className="text-gray-500 mt-1">Buat link undangan khusus untuk setiap tamu (Otomatis menampilkan nama tamu di cover).</p>
                </div>
                
                <div className={`${glassPanel} p-8 max-w-2xl`}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Tamu</label>
                      <input type="text" value={newGuestName} onChange={e=>setNewGuestName(e.target.value)} placeholder="Contoh: Bapak Budi Santoso" className={glassInput} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Diundang Oleh Pihak</label>
                      <select value={newGuestSide} onChange={e=>setNewGuestSide(e.target.value)} className={glassInput}>
                        <option value="pria">Pihak Pria (Akan memunculkan jadwal & maps resepsi pria)</option>
                        <option value="wanita">Pihak Wanita (Akan memunculkan jadwal & maps resepsi wanita)</option>
                      </select>
                    </div>
                    <button onClick={handleGenerateLink} className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-2xl hover:bg-[#D4AF37]/90 transition shadow-lg">Generate Link</button>
                    
                    {generatedLink && (
                      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="mt-6 p-6 bg-white/60 border border-gray-200 rounded-2xl text-center">
                        <p className="text-sm text-gray-600 mb-3 break-all font-mono bg-white p-3 rounded-lg border border-gray-100">{generatedLink}</p>
                        <div className="flex justify-center gap-3">
                          <button onClick={handleCopyLink} className="px-6 py-2 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-black transition">Copy Link</button>
                          <a href={generatedLink} target="_blank" className="px-6 py-2 border border-gray-300 rounded-xl text-sm font-bold hover:bg-gray-50 transition">Buka Tab Baru</a>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: RSVP */}
            {activeTab === "rsvp" && (
              <motion.div key="rsvp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-8 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 font-heading">Daftar RSVP</h2>
                    <p className="text-gray-500 mt-1">Konfirmasi kehadiran tamu undangan.</p>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-green-500/10 text-green-700 font-bold rounded-full hover:bg-green-500/20 transition-all text-sm">
                    <Download size={16} /> Export CSV
                  </button>
                </div>
                
                <div className={`${glassPanel} overflow-hidden`}>
                  <table className="w-full text-left">
                    <thead className="bg-white/40 border-b border-white/60">
                      <tr>
                        <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Nama Tamu</th>
                        <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                        <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Jumlah</th>
                        <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/40 bg-white/20">
                      {rsvps.map((rsvp) => (
                        <tr key={rsvp.id} className="hover:bg-white/40 transition">
                          <td className="px-8 py-4 text-sm font-bold text-gray-800">{rsvp.name}</td>
                          <td className="px-8 py-4 text-sm">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${rsvp.status === 'hadir' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                              {rsvp.status === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-sm font-medium text-gray-600">{rsvp.count || 0} Orang</td>
                          <td className="px-8 py-4 text-sm text-right">
                            <button onClick={async () => {
                              if(confirm("Hapus rsvp ini?")) await deleteDoc(doc(db, "rsvp", rsvp.id));
                            }} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors bg-white/50 shadow-sm border border-white/60">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {rsvps.length === 0 && <tr><td colSpan={4} className="px-8 py-12 text-center text-sm text-gray-500">Belum ada RSVP.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB: WISHES */}
            {activeTab === "wishes" && (
              <motion.div key="wishes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 font-heading">Pesan & Ucapan</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishes.map((wish) => (
                    <div key={wish.id} className={`${glassPanel} p-6 relative group hover:border-[#6B0F1A]/30 transition bg-white/60`}>
                      <h4 className="font-bold text-[#6B0F1A] text-lg">{wish.name}</h4>
                      <p className="text-sm text-gray-700 mt-3 leading-relaxed bg-white/50 p-4 rounded-2xl border border-white/60">{wish.text}</p>
                      <button onClick={async () => {
                         if(confirm("Hapus ucapan ini?")) await deleteDoc(doc(db, "wishes", wish.id));
                      }} className="absolute top-4 right-4 p-2 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {wishes.length === 0 && <div className="col-span-2 text-center py-12 text-gray-500">Belum ada ucapan.</div>}
                </div>
              </motion.div>
            )}

            {/* TAB: GIFTS */}
            {activeTab === "gifts" && (
              <motion.div key="gifts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-8 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 font-heading">Amplop Digital</h2>
                    <p className="text-gray-500 mt-1">Kelola nomor rekening bank / e-wallet untuk kado.</p>
                  </div>
                  <button onClick={() => {
                    const currentGifts = weddingData.gifts || [];
                    setWeddingData({...weddingData, gifts: [...currentGifts, { bank: "", accountNumber: "", accountName: "" }]});
                  }} className="flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] text-black font-bold rounded-full hover:bg-[#D4AF37]/90 transition-all text-sm">
                    <Plus size={16} /> Tambah Rekening
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                  {(weddingData.gifts || []).map((gift: any, index: number) => (
                    <div key={index} className={`${glassPanel} p-6 bg-white/60 relative`}>
                      <button onClick={() => {
                        const newGifts = [...weddingData.gifts];
                        newGifts.splice(index, 1);
                        setWeddingData({...weddingData, gifts: newGifts});
                      }} className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nama Bank / E-Wallet</label>
                          <input type="text" value={gift.bank} onChange={(e) => {
                            const newGifts = [...weddingData.gifts];
                            newGifts[index].bank = e.target.value;
                            setWeddingData({...weddingData, gifts: newGifts});
                          }} className={glassInput} placeholder="BCA / DANA / QRIS" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nomor Rekening</label>
                          <input type="text" value={gift.accountNumber} onChange={(e) => {
                            const newGifts = [...weddingData.gifts];
                            newGifts[index].accountNumber = e.target.value;
                            setWeddingData({...weddingData, gifts: newGifts});
                          }} className={glassInput} placeholder="12345678" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Atas Nama</label>
                          <input type="text" value={gift.accountName} onChange={(e) => {
                            const newGifts = [...weddingData.gifts];
                            newGifts[index].accountName = e.target.value;
                            setWeddingData({...weddingData, gifts: newGifts});
                          }} className={glassInput} placeholder="A.n Andi" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(weddingData.gifts?.length === 0 || !weddingData.gifts) && <div className="col-span-2 text-center py-12 text-gray-500">Belum ada data rekening.</div>}
                </div>

                <div className="sticky bottom-10 z-50 flex justify-end mt-8">
                  <button onClick={handleSaveWeddingData} className="px-10 py-4 bg-gradient-to-r from-[#6B0F1A] to-[#8E1422] text-[#D4AF37] font-bold rounded-full hover:shadow-[0_10px_30px_rgba(107,15,26,0.3)] transition-all flex items-center gap-2 transform hover:-translate-y-1">
                    <Settings size={20} /> Simpan Data Rekening
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB: THEME & DESIGN */}
            {activeTab === "theme" && (
              <motion.div key="theme" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-8 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 font-heading">Tema & Tampilan</h2>
                    <p className="text-gray-500 mt-1">Pilih template dan atur desain undangan sesuai keinginan.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
                  <div className={`${glassPanel} overflow-hidden`}>
                    <div className="bg-white/40 px-8 py-5 border-b border-white/60">
                      <h3 className="font-bold text-lg text-[#6B0F1A] flex items-center gap-2"><ImageIcon size={20} /> Template Undangan</h3>
                    </div>
                    <div className="p-8 space-y-4">
                      {availableThemes.map((theme) => (
                        <div 
                          key={theme.id} 
                          onClick={() => setWeddingData({...weddingData, theme: theme.id})}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                            weddingData.theme === theme.id 
                            ? 'border-[#6B0F1A] bg-[#6B0F1A]/5 shadow-md' 
                            : 'border-transparent bg-white/50 hover:bg-white/80'
                          }`}
                        >
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${theme.color} shadow-inner`}></div>
                          <div>
                            <h4 className="font-bold text-gray-800">{theme.name}</h4>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{theme.desc}</p>
                          </div>
                          {weddingData.theme === theme.id && (
                            <div className="ml-auto w-6 h-6 rounded-full bg-[#6B0F1A] text-white flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`${glassPanel} overflow-hidden h-fit`}>
                    <div className="bg-white/40 px-8 py-5 border-b border-white/60">
                      <h3 className="font-bold text-lg text-[#6B0F1A] flex items-center gap-2"><Settings size={20} /> Pengaturan Lanjutan</h3>
                    </div>
                    <div className="p-8 space-y-6">
                      <p className="text-sm text-gray-600 mb-4">Pengaturan warna kustom dan font akan menimpa bawaan template (Opsional).</p>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Warna Primer</label>
                        <div className="flex items-center gap-4">
                          <input type="color" value={weddingData.primaryColor || "#6B0F1A"} onChange={e => setWeddingData({...weddingData, primaryColor: e.target.value})} className="w-12 h-12 rounded cursor-pointer border-0 p-0" />
                          <input type="text" value={weddingData.primaryColor || "#6B0F1A"} onChange={e => setWeddingData({...weddingData, primaryColor: e.target.value})} className={glassInput} />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Warna Sekunder (Aksen)</label>
                        <div className="flex items-center gap-4">
                          <input type="color" value={weddingData.secondaryColor || "#D4AF37"} onChange={e => setWeddingData({...weddingData, secondaryColor: e.target.value})} className="w-12 h-12 rounded cursor-pointer border-0 p-0" />
                          <input type="text" value={weddingData.secondaryColor || "#D4AF37"} onChange={e => setWeddingData({...weddingData, secondaryColor: e.target.value})} className={glassInput} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Link Lagu Latar (MP3)</label>
                        <input type="text" value={weddingData.bgMusic || ""} onChange={e => setWeddingData({...weddingData, bgMusic: e.target.value})} placeholder="https://contoh.com/lagu.mp3" className={glassInput} />
                      </div>
                    </div>
                  </div>
                  </div>

                  <div className={`${glassPanel} overflow-hidden h-fit md:col-span-2`}>
                    <div className="bg-white/40 px-8 py-5 border-b border-white/60">
                      <h3 className="font-bold text-lg text-[#6B0F1A] flex items-center gap-2"><ImageIcon size={20} /> Custom Background (Desain Canva)</h3>
                    </div>
                    <div className="p-8 space-y-6">
                      <p className="text-sm text-gray-600 mb-4">Gunakan gambar desain Anda sendiri (misal dari Canva). Jika diisi, ini akan menimpa background dari Tema yang dipilih di atas.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Background Cover Depan</label>
                          <div className="flex flex-col gap-3">
                            {weddingData.coverBackground && (
                              <div className="w-full h-32 rounded-xl bg-cover bg-center border border-gray-200" style={{ backgroundImage: `url(${weddingData.coverBackground})` }}></div>
                            )}
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "coverBackground")} disabled={isUploading} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#6B0F1A]/10 file:text-[#6B0F1A] hover:file:bg-[#6B0F1A]/20 transition" />
                            <p className="text-xs text-gray-400">Atau masukkan URL gambar:</p>
                            <input type="text" value={weddingData.coverBackground || ""} onChange={e => setWeddingData({...weddingData, coverBackground: e.target.value})} placeholder="https://..." className={glassInput} />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Background Bagian Dalam (Hero)</label>
                          <div className="flex flex-col gap-3">
                            {weddingData.heroBackground && (
                              <div className="w-full h-32 rounded-xl bg-cover bg-center border border-gray-200" style={{ backgroundImage: `url(${weddingData.heroBackground})` }}></div>
                            )}
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "heroBackground")} disabled={isUploading} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#6B0F1A]/10 file:text-[#6B0F1A] hover:file:bg-[#6B0F1A]/20 transition" />
                            <p className="text-xs text-gray-400">Atau masukkan URL gambar:</p>
                            <input type="text" value={weddingData.heroBackground || ""} onChange={e => setWeddingData({...weddingData, heroBackground: e.target.value})} placeholder="https://..." className={glassInput} />
                          </div>
                        </div>
                      </div>
                      {isUploading && <p className="text-sm text-[#6B0F1A] font-bold animate-pulse">Sedang mengupload gambar...</p>}
                    </div>
                  </div>
                <div className="sticky bottom-10 z-50 flex justify-end mt-8">
                  <button onClick={handleSaveWeddingData} className="px-10 py-4 bg-gradient-to-r from-[#6B0F1A] to-[#8E1422] text-[#D4AF37] font-bold rounded-full hover:shadow-[0_10px_30px_rgba(107,15,26,0.3)] transition-all flex items-center gap-2 transform hover:-translate-y-1">
                    <Settings size={20} /> Simpan Pengaturan Tema
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB: SECTIONS */}
            {activeTab === "sections" && (
              <motion.div key="sections" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 font-heading">Tampilan Menu (Section)</h2>
                  <p className="text-gray-500 mt-1">Aktifkan atau nonaktifkan bagian undangan yang ingin ditampilkan.</p>
                </div>

                <div className={`${glassPanel} overflow-hidden pb-20`}>
                  <div className="bg-white/40 px-8 py-5 border-b border-white/60 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-[#6B0F1A] flex items-center gap-2"><LayoutList size={20} /> Urutan & Tampilan Section</h3>
                    <p className="text-xs text-gray-500 bg-white/50 px-3 py-1 rounded-full">Gunakan tombol ⬆️ ⬇️ untuk mengubah urutan</p>
                  </div>
                  
                  <div className="p-8 space-y-4">
                    {(weddingData.sectionOrder || [
                      "hero", "intro", "quote", "couple", "loveStory", "countdown", "schedule", "gallery", "rsvp", "wishes", "gift", "maps", "thankYou"
                    ]).map((sectionId: string, index: number, currentOrder: string[]) => {
                      const isActive = weddingData.sections?.[sectionId] ?? true;
                      const allSectionsInfo: Record<string, {label: string, desc: string}> = {
                        "hero": { label: "Cover Depan & Header", desc: "Bagian atas undangan dengan foto utama." },
                        "intro": { label: "Salam Pembuka (Intro)", desc: "Ucapan salam dan pengantar undangan." },
                        "quote": { label: "Kutipan / Ayat Suci", desc: "Ayat Al-Quran, doa, atau quotes cinta." },
                        "couple": { label: "Profil Mempelai", desc: "Menampilkan nama dan detail kedua mempelai." },
                        "loveStory": { label: "Cerita Cinta (Love Story)", desc: "Bagian cerita perjalanan cinta pasangan." },
                        "countdown": { label: "Countdown Timer", desc: "Penghitung mundur hari menuju acara." },
                        "schedule": { label: "Jadwal Acara", desc: "Detail hari, tanggal, dan jam akad/resepsi." },
                        "gallery": { label: "Galeri Foto", desc: "Kumpulan foto pre-wedding." },
                        "maps": { label: "Peta Lokasi (Maps)", desc: "Menampilkan peta Google Maps." },
                        "rsvp": { label: "Form Kehadiran (RSVP)", desc: "Formulir konfirmasi kehadiran tamu." },
                        "wishes": { label: "Buku Tamu / Ucapan", desc: "Menampilkan dan menerima ucapan doa." },
                        "gift": { label: "Amplop Digital (Gift)", desc: "Informasi rekening bank / QRIS." },
                        "thankYou": { label: "Penutup / Terima Kasih", desc: "Ucapan terima kasih di bagian paling bawah." },
                      };
                      const section = allSectionsInfo[sectionId];
                      if (!section) return null;

                      const moveUp = () => {
                        if (index === 0) return;
                        const newOrder = [...currentOrder];
                        [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
                        setWeddingData({...weddingData, sectionOrder: newOrder});
                      };
                      
                      const moveDown = () => {
                        if (index === currentOrder.length - 1) return;
                        const newOrder = [...currentOrder];
                        [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
                        setWeddingData({...weddingData, sectionOrder: newOrder});
                      };

                      return (
                        <div key={sectionId} className={`flex items-center gap-4 p-5 bg-white/60 rounded-2xl border border-white/80 shadow-sm transition-all ${!isActive ? 'opacity-60' : ''}`}>
                          <div className="flex flex-col gap-1">
                            <button onClick={moveUp} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">⬆️</button>
                            <button onClick={moveDown} disabled={index === currentOrder.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">⬇️</button>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{index + 1}. {section.label}</h4>
                            <p className="text-xs text-gray-500 mt-1">{section.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={isActive}
                              onChange={(e) => {
                                setWeddingData({
                                  ...weddingData,
                                  sections: {
                                    ...(weddingData.sections || {}),
                                    [sectionId]: e.target.checked
                                  }
                                });
                              }}
                            />
                            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#6B0F1A]"></div>
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="sticky bottom-10 z-50 flex justify-end mt-8">
                  <button onClick={handleSaveWeddingData} className="px-10 py-4 bg-gradient-to-r from-[#6B0F1A] to-[#8E1422] text-[#D4AF37] font-bold rounded-full hover:shadow-[0_10px_30px_rgba(107,15,26,0.3)] transition-all flex items-center gap-2 transform hover:-translate-y-1">
                    <Settings size={20} /> Simpan Tampilan
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Konten Kanan: Live Preview Smartphone */}
      {(activeTab === "wedding" || activeTab === "theme" || activeTab === "sections") && (
        <div className="hidden lg:flex lg:w-[40%] bg-gray-100 border-l border-gray-200 h-screen relative flex-col items-center justify-center p-8 sticky top-0">
          <div className="absolute top-6 w-full flex justify-center z-10">
            <div className="bg-gray-800 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Preview Real-time
            </div>
          </div>
          
          <div className="w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl border-[10px] border-gray-900 overflow-hidden relative group">
            {/* iPhone Notch Mockup */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-20"></div>
            
            <iframe 
              src={`/invite/${selectedClient.slug}?adminPreview=true`} 
              className="w-full h-full border-none relative z-10"
              title="Live Preview"
            />
            
            {/* Phone buttons Mockup */}
            <div className="absolute -left-3 top-24 w-1.5 h-12 bg-gray-800 rounded-l-md"></div>
            <div className="absolute -left-3 top-40 w-1.5 h-16 bg-gray-800 rounded-l-md"></div>
            <div className="absolute -left-3 top-60 w-1.5 h-16 bg-gray-800 rounded-l-md"></div>
            <div className="absolute -right-3 top-32 w-1.5 h-20 bg-gray-800 rounded-r-md"></div>
          </div>
        </div>
      )}
    </div>
  );
}
// Placeholder components
function DatabaseIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
}
