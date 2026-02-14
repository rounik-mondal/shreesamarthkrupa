'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import Loader from './Loader';

// /* ================= LOADER ================= */
// function Loader() {
//   return (
//     <motion.div
//       className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
//       initial={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.7 }}
//     >
//       <div className="flex flex-col items-center gap-6">
//         <motion.div
//           className="h-14 w-14 rounded-full border-2 border-white/20 border-t-gold-400"
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//         />

//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 0.7 }}
//           transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
//           className="text-white/70 tracking-[0.35em] text-xs"
//         >
//           LOADING LUXURY
//         </motion.p>
//       </div>
//     </motion.div>
//   );
// }

/* ================= HERO ================= */
export default function Hero() {
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef(null);
  const resolvedRef = useRef(false);

  // ✅ Safety timeout (NEVER stuck)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!resolvedRef.current) {
        resolvedRef.current = true;
        setIsReady(true);
      }
    }, 3000); // max wait

    return () => clearTimeout(timer);
  }, []);

  // ✅ Best readiness signal
  const handleVideoReady = () => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;

    // small luxury delay
    setTimeout(() => setIsReady(true), 500);
  };

  const handleVideoError = () => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    setIsReady(true);
  };

  return (
    <>
      {/* Loader */}
      <AnimatePresence mode="wait">
        {!isReady && <Loader />}
      </AnimatePresence>

      <section
        className={`relative h-screen w-full overflow-hidden bg-black transition-all duration-700 ${
          isReady ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
        }`}
      >
        {/* ================= BACKGROUND ================= */}
        <div className="absolute inset-0 z-0 overflow-hidden">

          <motion.video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlayThrough={handleVideoReady}   // ⭐ key change
            onError={handleVideoError}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1.12 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
          >
            <source src="/video/sofa.mp4" type="video/mp4" />
          </motion.video>

          {/* overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          <div className="absolute inset-0 bg-royal-900/20 mix-blend-multiply" />
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[url('/image/noise.png')]" />
        </div>

        {/* ================= CONTENT ================= */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 text-xs md:text-sm uppercase tracking-[0.35em] text-gold-400 font-semibold"
          >
            Est. 2024 • Manufacturing Excellence
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mb-6 font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05]"
          >
            Shree Samarth <br className="hidden md:block" />
            <span className="italic text-gold-400">Krupa</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mb-12 max-w-xl text-base md:text-lg text-white/80 font-light leading-relaxed"
          >
            Redefining Indian luxury with bespoke sofas, handcrafted wallpapers,
            and premium textiles tailored to your vision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/shop"
              className="group relative px-10 py-4 bg-white text-royal-900 font-semibold tracking-wide overflow-hidden rounded-sm"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                Explore Collection
              </span>
              <div className="absolute inset-0 bg-royal-900 transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </Link>

            <Link
              href="/customizer"
              className="px-10 py-4 border border-white/70 text-white font-semibold tracking-wide hover:bg-white/10 backdrop-blur-sm transition-all duration-300 rounded-sm"
            >
              Design Your Own
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6, y: [0, 10, 0] }}
            transition={{ delay: 1.2, duration: 2, repeat: Infinity }}
            className="absolute bottom-8 text-white/60 text-xs tracking-widest"
          >
            SCROLL
          </motion.div>
        </div>
      </section>
    </>
  );
}
