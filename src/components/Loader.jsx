'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const Loader = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div className="relative flex flex-col items-center justify-center">

        {/* Outer subtle glow */}
        <motion.div
          className="absolute h-24 w-24 rounded-full bg-gold-400/5 blur-2xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Logo (small + breathing effect) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: [1, 1.05, 1] }}
          transition={{
            opacity: { duration: 0.8 },
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="relative z-10"
        >
          <Image
            src="/image/logo.svg"
            alt="Shree Samarth Krupa"
            width={120}
            height={120}
            priority
            className="object-contain"
          />
        </motion.div>

        {/* Brand text */}
        <motion.p
          className="mt-8 text-white/60 text-[20px] tracking-[0.3em] font-light"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Shree Samarth Krupa
        </motion.p>

      </div>
    </motion.div>
  );
};

export default Loader;
