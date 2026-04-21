"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Home, Heart, Calendar, MapPin, Send, Volume2, VolumeX } from "lucide-react";
import Cover from "@/components/Cover";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Quote from "@/components/Quote";
import Couple from "@/components/Couple";
import LoveStory from "@/components/LoveStory";
import Countdown from "@/components/Countdown";
import Schedule from "@/components/Schedule";
import Gallery from "@/components/Gallery";
import RSVP from "@/components/RSVP";
import Wishes from "@/components/Wishes";
import Gift from "@/components/Gift";
import { useSearchParams } from "next/navigation";
import Maps from "@/components/Maps";
import ThankYou from "@/components/ThankYou";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";

export default function InvitationClient({ guestName, family, slug }: { guestName: string, family: string, slug: string }) {
  const searchParams = useSearchParams();
  const isAdminPreview = searchParams.get("adminPreview") === "true";

  const [isLoading, setIsLoading] = useState(!isAdminPreview);
  const [isOpened, setIsOpened] = useState(isAdminPreview);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showNav, setShowNav] = useState(isAdminPreview);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [musicPermissionGranted, setMusicPermissionGranted] = useState(false);

  const [weddingData, setWeddingData] = useState<any>({
    groomName: "Andi Pangerang",
    groomParents: "Bapak Andi Muhammad & Ibu Hj. Fatimah",
    brideName: "Tenri Abeng",
    brideParents: "Bapak H. Daeng Mappanyukki & Ibu Hj. Siti Aminah",
    weddingDate: "2026-12-25",
    akadTime: "09:00",
    akadLocation: "Masjid Raya Makassar",
    akadMaps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.8055615715563!2d119.43577311476882!3d-5.134958896274005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee2b3be059f37%3A0x80bf9d0e2e283f98!2sClaro%20Hotel%20Makassar!5e0!3m2!1sen!2sid!4v1689264875084!5m2!1sen!2sid",
    priaTime: "11:00",
    priaLocation: "Hotel Claro Makassar",
    priaMaps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.8055615715563!2d119.43577311476882!3d-5.134958896274005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee2b3be059f37%3A0x80bf9d0e2e283f98!2sClaro%20Hotel%20Makassar!5e0!3m2!1sen!2sid!4v1689264875084!5m2!1sen!2sid",
    wanitaTime: "11:00",
    wanitaLocation: "Gedung Manunggal Makassar",
    wanitaMaps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.8055615715563!2d119.43577311476882!3d-5.134958896274005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee2b3be059f37%3A0x80bf9d0e2e283f98!2sClaro%20Hotel%20Makassar!5e0!3m2!1sen!2sid!4v1689264875084!5m2!1sen!2sid",
    sections: {
      hero: true,
      intro: true,
      quote: true,
      couple: true,
      loveStory: true,
      countdown: true,
      schedule: true,
      gallery: true,
      rsvp: true,
      wishes: true,
      gift: true,
      maps: true,
      thankYou: true
    }
  });

  useEffect(() => {
    if (isAdminPreview) {
      setIsOpened(true);
      setIsLoading(false);
    }
    const unsub = onSnapshot(doc(db, "clients", slug), (docSnap) => {
      if (docSnap.exists()) {
        setWeddingData(docSnap.data() as any);
      } else {
        const unsubLegacy = onSnapshot(doc(db, "settings", "wedding_info"), (legacySnap) => {
           if(legacySnap.exists()) {
             setWeddingData(legacySnap.data() as any);
           }
        });
      }
    });

    const handleScroll = () => {
      const sections = ["hero", "couple", "schedule", "maps", "rsvp"];
      const current = sections.find((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top >= -100 && rect.top <= 300;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      unsub();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Collect all image URLs that need to be preloaded
  const imagesToPreload = useMemo(() => {
    const images: string[] = [];
    // Cover/Hero backgrounds
    if (weddingData.coverBackground) images.push(weddingData.coverBackground);
    if (weddingData.heroBackground) images.push(weddingData.heroBackground);
    // Gallery images from data
    if (weddingData.galleryImages && weddingData.galleryImages.length > 0) {
      images.push(...weddingData.galleryImages);
    }
    // Groom/Bride photos
    if (weddingData.groomPhoto) images.push(weddingData.groomPhoto);
    if (weddingData.bridePhoto) images.push(weddingData.bridePhoto);
    return images;
  }, [weddingData]);

  const audioSrc = weddingData.bgMusic || "/music/wedding-song.mp3";

  const handleOpen = () => {
    setIsOpened(true);
    
    // Play music only if user has granted permission during cover screen
    if (musicPermissionGranted && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch((err) => {
        console.log("Audio play blocked:", err);
        setIsMusicPlaying(false);
      });
    }
    
    // Auto scroll story mode
    setTimeout(() => {
      setIsAutoScrolling(true);
      const interval = setInterval(() => {
        window.scrollBy(0, 1.5);
        // If reached bottom
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
          clearInterval(interval);
          setIsAutoScrolling(false);
          setShowNav(true);
        }
      }, 20); // 50fps smooth scroll

      // Allow user to cancel auto-scroll by scrolling manually
      const cancelScroll = () => {
        clearInterval(interval);
        setIsAutoScrolling(false);
        setShowNav(true);
      };
      
      window.addEventListener('wheel', cancelScroll, { once: true });
      window.addEventListener('touchstart', cancelScroll, { once: true });
    }, 1000);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(() => {
          console.log("Cannot play music - user interaction required");
          setIsMusicPlaying(false);
        });
      }
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const getThemeStyles = () => {
    let primary = "#6B0F1A";
    let secondary = "#D4AF37";
    let bg = "#F8F5F0";

    if (weddingData.theme === "elegant-gold") {
      primary = "#D4AF37"; secondary = "#B8912E"; bg = "#1A1A1A";
    } else if (weddingData.theme === "minimalist-white") {
      primary = "#333333"; secondary = "#888888"; bg = "#FFFFFF";
    } else if (weddingData.theme === "floral-garden") {
      primary = "#2E3B16"; secondary = "#4A5D23"; bg = "#F4F7F0";
    }

    if (weddingData.primaryColor) primary = weddingData.primaryColor;
    if (weddingData.secondaryColor) secondary = weddingData.secondaryColor;

    return `
      :root {
        --color-brand-maroon: ${primary};
        --color-brand-gold: ${secondary};
        --color-brand-ivory: ${bg};
        --background: ${bg};
        --foreground: ${primary};
      }
      .text-gradient {
        background: linear-gradient(to right, ${secondary}, ${primary});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    `;
  };

  const sections = weddingData.sections || {};

  return (
    <main className="relative min-h-screen bg-brand-ivory text-brand-maroon overflow-x-hidden pb-20">
      <style>{getThemeStyles()}</style>
      
      {/* Smart Loading: Actually preloads all images + audio */}
      {isLoading && (
        <LoadingScreen
          onComplete={() => setIsLoading(false)}
          imagesToPreload={imagesToPreload}
          audioSrc={audioSrc}
          groomName={weddingData.groomName || "A"}
          brideName={weddingData.brideName || "T"}
        />
      )}
      
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />
      
      {isOpened && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleMusic}
          className="fixed top-6 right-6 z-50 p-3 rounded-full bg-brand-maroon/80 text-brand-gold backdrop-blur-md shadow-lg border border-brand-gold/30 hover:scale-110 transition-transform"
        >
          {isMusicPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </motion.button>
      )}

      <AnimatePresence>
        {!isLoading && !isOpened && (
          <Cover
            guestName={guestName}
            onOpen={handleOpen}
            data={weddingData}
            onMusicPermission={(granted: boolean) => setMusicPermissionGranted(granted)}
          />
        )}
      </AnimatePresence>

      <div className={`transition-opacity duration-1000 ${isOpened ? "opacity-100" : "opacity-0 h-screen overflow-hidden"}`}>
        {isOpened && (
          <>
            {/* Dynamic Rendering Based on Order */}
            {(weddingData.sectionOrder || ['hero', 'intro', 'quote', 'couple', 'loveStory', 'countdown', 'schedule', 'gallery', 'rsvp', 'wishes', 'gift', 'maps', 'thankYou']).map((sectionId: string) => {
              if (sections[sectionId] === false) return null; // Skip if disabled
              
              switch (sectionId) {
                case 'hero': return <div key="hero" id="hero"><Hero data={weddingData} /></div>;
                case 'intro': return <div key="intro" id="intro"><Intro data={weddingData} /></div>;
                case 'quote': return <div key="quote" id="quote"><Quote data={weddingData} /></div>;
                case 'couple': return <div key="couple" id="couple"><Couple data={weddingData} /></div>;
                case 'loveStory': return <div key="loveStory" id="loveStory"><LoveStory /></div>;
                case 'countdown': return <div key="countdown" id="countdown"><Countdown data={weddingData} /></div>;
                case 'schedule': return <div key="schedule" id="schedule"><Schedule data={weddingData} family={family} /></div>;
                case 'gallery': return <div key="gallery" id="gallery"><Gallery data={weddingData} /></div>;
                case 'rsvp': return <div key="rsvp" id="rsvp"><RSVP guestName={guestName} slug={slug} /></div>;
                case 'wishes': return <div key="wishes" id="wishes"><Wishes slug={slug} /></div>;
                case 'gift': return <div key="gift" id="gift"><Gift data={weddingData} /></div>;
                case 'maps': return <div key="maps" id="maps"><Maps data={weddingData} family={family} /></div>;
                case 'thankYou': return <div key="thankYou" id="thankYou"><ThankYou data={weddingData} /></div>;
                default: return null;
              }
            })}
            
            <Footer data={weddingData} />

            {/* Bottom Navigation */}
            <AnimatePresence>
              {showNav && (
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-brand-maroon/10 flex gap-6 items-center"
                >
                  {[
                    { id: "hero", icon: <Home size={20} />, show: sections.hero !== false },
                    { id: "couple", icon: <Heart size={20} />, show: sections.couple !== false },
                    { id: "schedule", icon: <Calendar size={20} />, show: sections.schedule !== false },
                    { id: "maps", icon: <MapPin size={20} />, show: sections.maps !== false },
                    { id: "rsvp", icon: <Send size={20} />, show: sections.rsvp !== false },
                  ].filter(item => item.show).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollTo(item.id)}
                      className={`p-2 transition-colors rounded-full ${activeSection === item.id ? 'bg-brand-maroon text-brand-gold scale-110' : 'text-gray-400 hover:text-brand-maroon'}`}
                    >
                      {item.icon}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </main>
  );
}
