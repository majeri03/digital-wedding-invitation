"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
  imagesToPreload?: string[];
  audioSrc?: string;
  groomName?: string;
  brideName?: string;
}

/**
 * Smart Loading Screen - Actually preloads ALL images and audio.
 * Only completes after every asset is loaded or fails gracefully.
 */
export default function LoadingScreen({
  onComplete,
  imagesToPreload = [],
  audioSrc,
  groomName = "A",
  brideName = "T",
}: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Mempersiapkan undangan...");
  const [totalAssets, setTotalAssets] = useState(0);
  const [loadedAssets, setLoadedAssets] = useState(0);

  const handleComplete = useCallback(() => {
    setProgress(100);
    setLoadingText("Siap! ✨");
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // wait for exit animation
    }, 600);
  }, [onComplete]);

  useEffect(() => {
    // Collect all default images that components use
    const defaultImages = [
      "/images/bg-pattern.webp",
      "/images/hero-bg.jpg",
      "/images/groom.jpg",
      "/images/bride.jpg",
      "/images/gallery-1.jpg",
      "/images/gallery-2.jpg",
      "/images/gallery-3.jpg",
      "/images/gallery-4.jpg",
      "/images/gallery-5.jpg",
      "/images/gallery-6.jpg",
    ];

    // Merge default + dynamic images, remove duplicates and empty strings
    const allImages = [...new Set([...defaultImages, ...imagesToPreload])].filter(Boolean);
    const total = allImages.length + (audioSrc ? 1 : 0);
    setTotalAssets(total);

    if (total === 0) {
      handleComplete();
      return;
    }

    let loaded = 0;
    const texts = [
      "Memuat gambar-gambar indah...",
      "Menyiapkan galeri foto...",
      "Memuat musik latar...",
      "Hampir selesai...",
    ];

    const onAssetLoad = () => {
      loaded++;
      setLoadedAssets(loaded);
      const pct = Math.round((loaded / total) * 100);
      setProgress(pct);

      // Update loading text based on progress
      if (pct < 30) setLoadingText(texts[0]);
      else if (pct < 60) setLoadingText(texts[1]);
      else if (pct < 90) setLoadingText(texts[2]);
      else setLoadingText(texts[3]);

      if (loaded >= total) {
        handleComplete();
      }
    };

    // Preload all images
    allImages.forEach((src) => {
      const img = new window.Image();
      img.onload = onAssetLoad;
      img.onerror = onAssetLoad; // count failed images as loaded to not block
      img.src = src;
    });

    // Preload audio
    if (audioSrc) {
      const audio = new Audio();
      audio.preload = "auto";
      
      const onAudioReady = () => {
        audio.removeEventListener("canplaythrough", onAudioReady);
        audio.removeEventListener("error", onAudioError);
        onAssetLoad();
      };
      
      const onAudioError = () => {
        audio.removeEventListener("canplaythrough", onAudioReady);
        audio.removeEventListener("error", onAudioError);
        onAssetLoad(); // don't block loading if audio fails
      };

      audio.addEventListener("canplaythrough", onAudioReady);
      audio.addEventListener("error", onAudioError);
      audio.src = audioSrc;
      audio.load();
    }

    // Safety timeout: force complete after 15 seconds if assets are too slow
    const safetyTimer = setTimeout(() => {
      if (loaded < total) {
        console.warn(`Loading timeout: ${loaded}/${total} assets loaded. Proceeding anyway.`);
        handleComplete();
      }
    }, 15000);

    return () => clearTimeout(safetyTimer);
  }, [imagesToPreload, audioSrc, handleComplete]);

  const initials = `${groomName.charAt(0)} & ${brideName.charAt(0)}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-maroon text-brand-gold overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('/images/bg-pattern.webp')] bg-cover opacity-10 mix-blend-overlay"></div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: "100%" }}
                animate={{
                  opacity: [0, 0.6, 0],
                  y: [
                    `${80 + Math.random() * 20}%`,
                    `${-10 - Math.random() * 20}%`,
                  ],
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeOut",
                }}
                className="absolute bg-brand-gold rounded-full"
                style={{
                  width: Math.random() * 4 + 2 + "px",
                  height: Math.random() * 4 + 2 + "px",
                  left: Math.random() * 100 + "%",
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center px-6"
          >
            {/* Elegant Spinner with Initials */}
            <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{
                  border: "2px solid transparent",
                  borderTopColor: "var(--color-brand-gold)",
                  borderRightColor: "var(--color-brand-gold)",
                  opacity: 0.6,
                }}
              />
              {/* Inner ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 rounded-full"
                style={{
                  border: "2px solid transparent",
                  borderBottomColor: "var(--color-brand-gold)",
                  borderLeftColor: "var(--color-brand-gold)",
                  opacity: 0.4,
                }}
              />
              {/* Pulsing glow */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-6 rounded-full bg-brand-gold/10 blur-sm"
              />
              <span className="font-heading text-2xl italic text-brand-gold">
                {initials}
              </span>
            </div>

            <h1 className="text-xl tracking-[0.2em] uppercase text-brand-ivory mb-3 font-heading">
              The Wedding
            </h1>

            {/* Progress Bar */}
            <div className="w-56 h-1.5 bg-white/10 rounded-full overflow-hidden mb-4 backdrop-blur-sm">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full rounded-full relative"
                style={{
                  background: "linear-gradient(90deg, var(--color-brand-gold), #F3E5AB, var(--color-brand-gold))",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </motion.div>
            </div>

            {/* Loading text + percentage */}
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs tracking-widest opacity-60 mb-1"
            >
              {loadingText}
            </motion.p>
            <p className="text-[10px] text-brand-gold/40 font-mono">
              {loadedAssets}/{totalAssets} assets
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
