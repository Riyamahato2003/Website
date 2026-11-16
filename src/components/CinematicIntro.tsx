import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Language } from '../types';
import { UI_COPY } from '../data/translations';

interface CinematicIntroProps {
  language: Language;
  visible: boolean;
  onComplete: () => void;
}

export function CinematicIntro({ language, visible, onComplete }: CinematicIntroProps) {
  const copy = UI_COPY[language];
  const [phase, setPhase] = useState<'ascend' | 'reveal'>('ascend');

  useEffect(() => {
    if (!visible) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      const quick = window.setTimeout(onComplete, 450);
      return () => window.clearTimeout(quick);
    }

    setPhase('ascend');
    const t1 = window.setTimeout(() => setPhase('reveal'), 1150);
    const t2 = window.setTimeout(onComplete, 3200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -24,
            transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#FAF7F2] px-6"
          aria-label="Ballonnette Opening"
        >
          {/* Ambient Sunlit Studio Light Shaft */}
          <motion.div
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 38%, rgba(255,255,255,0.95) 0%, rgba(207,162,166,0.16) 36%, rgba(108,131,150,0.10) 60%, rgba(239,234,226,0.85) 100%)',
            }}
          />

          {/* Fine Atelier Architectural Border */}
          <div className="pointer-events-none absolute inset-4 border border-[#B99768]/25 sm:inset-8" />

          {/* Floating Photorealistic Transparent Gift Balloon */}
          <motion.div
            initial={{ y: 120, scale: 0.82, opacity: 0 }}
            animate={{
              y: phase === 'reveal' ? -14 : 0,
              scale: 1,
              opacity: 1,
            }}
            transition={{ duration: 1.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center"
          >
            {/* Soft Blush & Pearl Mini Satellite Balloons */}
            <motion.div
              animate={{ y: [-3, 5, -3] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute -top-2 -right-8 z-20 h-16 w-16"
              aria-hidden="true"
            >
              <div
                className="absolute top-0 left-2 h-8 w-8 rounded-full shadow-md"
                style={{
                  background: 'radial-gradient(circle at 30% 25%, #fff 0%, #E8C9CC 55%, #CFA2A6 100%)',
                }}
              />
              <div
                className="absolute top-4 right-0 h-9 w-9 rounded-full shadow-md"
                style={{
                  background: 'radial-gradient(circle at 30% 25%, #fff 0%, #F4EFE6 60%, #DFD4C3 100%)',
                }}
              />
            </motion.div>

            {/* Crown Satin Bow */}
            <svg
              viewBox="0 0 140 56"
              className="relative z-30 -mb-4 h-12 w-28 drop-shadow-md sm:h-14 sm:w-32"
              aria-hidden="true"
            >
              <path d="M68 24 C45 4, 16 6, 19 25 C21 38, 48 32, 68 24 Z" fill="#CFA2A6" />
              <path d="M72 24 C95 4, 124 6, 121 25 C119 38, 92 32, 72 24 Z" fill="#E4BEC2" />
              <rect x="63" y="18" width="14" height="12" rx="5" fill="#A67A7F" />
            </svg>

            {/* Crystal Balloon Sphere containing signature plush vignette */}
            <div
              className="relative flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border border-white/90 shadow-[0_32px_70px_-18px_rgba(35,32,30,0.28)] sm:h-64 sm:w-64"
              style={{
                background:
                  'radial-gradient(circle at 30% 24%, rgba(255,255,255,0.72) 0%, rgba(250,247,242,0.22) 48%, rgba(207,162,166,0.22) 82%, rgba(108,131,150,0.26) 100%)',
              }}
            >
              <img
                src="/src/assets/images/inside_pink_bunny_1794825466527.jpg"
                alt=""
                className="h-40 w-40 translate-y-3 rounded-full object-cover opacity-90 sm:h-44 sm:w-44"
                style={{
                  WebkitMaskImage: 'radial-gradient(circle, black 56%, transparent 98%)',
                  maskImage: 'radial-gradient(circle, black 56%, transparent 98%)',
                }}
              />
              {/* Specular Window Reflections */}
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  boxShadow:
                    'inset 16px 18px 36px rgba(255,255,255,0.88), inset -16px -18px 36px rgba(108,131,150,0.18)',
                }}
              />
              <div
                className="pointer-events-none absolute top-5 left-7 h-20 w-10 -rotate-[22deg] rounded-full opacity-80"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)',
                }}
              />
            </div>

            {/* Naturally Flowing Silk Ribbons */}
            <motion.svg
              viewBox="0 0 120 120"
              className="mx-auto -mt-2 h-24 w-28"
              initial={{ opacity: 0, scaleY: 0.5 }}
              animate={{ opacity: 0.95, scaleY: 1 }}
              transition={{ duration: 1.1, delay: 0.3 }}
              aria-hidden="true"
            >
              <motion.path
                animate={{
                  d: [
                    'M60 0 C44 38, 68 72, 46 116',
                    'M60 0 C50 38, 58 72, 54 116',
                    'M60 0 C44 38, 68 72, 46 116',
                  ],
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                fill="none"
                stroke="#CFA2A6"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <motion.path
                animate={{
                  d: [
                    'M60 0 C74 42, 50 76, 72 118',
                    'M60 0 C68 42, 60 76, 66 118',
                    'M60 0 C74 42, 50 76, 72 118',
                  ],
                }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
                fill="none"
                stroke="#6C8396"
                strokeWidth="1.7"
                strokeLinecap="round"
                opacity="0.78"
              />
            </motion.svg>
          </motion.div>

          {/* Editorial Brand Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mt-4 text-center"
          >
            <p className="mb-2 text-[11px] font-medium tracking-[0.3em] text-[#6C8396] uppercase">
              {copy.introSubtitle}
            </p>
            <h1 className="font-serif-display text-5xl font-normal tracking-[0.14em] text-[#23201E] sm:text-6xl md:text-7xl">
              BALLONNETTE
            </h1>
            <p className="mt-3 text-xs tracking-[0.16em] text-[#6B645E] uppercase">
              {copy.introTagline}
            </p>
          </motion.div>

          <button
            type="button"
            onClick={onComplete}
            className="relative z-10 mt-9 border-b border-[#B99768] pb-1 text-xs font-medium tracking-[0.18em] text-[#23201E] uppercase transition-colors hover:border-[#6C8396] hover:text-[#6C8396] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6C8396]"
          >
            {copy.introSkip}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
