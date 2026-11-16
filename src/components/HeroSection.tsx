import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { BuilderConfig, Language } from '../types';
import { UI_COPY } from '../data/translations';

interface HeroSectionProps {
  language: Language;
  onStartBuilder: () => void;
  onJumpConcierge: () => void;
  onQuickPreset: (patch: Partial<BuilderConfig>) => void;
}

export function HeroSection({
  language,
  onStartBuilder,
  onJumpConcierge,
  onQuickPreset,
}: HeroSectionProps) {
  const copy = UI_COPY[language];
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x: nx * 18, y: ny * 14 });
  };

  return (
    <section
      id="top"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setParallax({ x: 0, y: 0 })}
      className="relative overflow-hidden border-b border-[#E3DCD1] bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE6] to-[#EFEAE2]"
    >
      {/* Subtle Sunlit Champagne Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 22%, rgba(255,255,255,0.92) 0%, rgba(207,162,166,0.12) 38%, rgba(108,131,150,0.08) 72%, transparent 100%)',
        }}
      />

      {/* Fine Architectural Grid Hairlines */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-[#E3DCD1]/60 lg:block" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-4 pt-10 pb-14 sm:px-8 lg:pt-14 lg:pb-20">
        {/* Top Oversized Editorial Art Direction Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="text-xs font-medium tracking-[0.24em] text-[#6C8396] uppercase">
            {copy.heroEyebrow}
          </p>

          <h1 className="mt-4 font-serif-display text-balance text-[clamp(2.75rem,6vw,5.45rem)] leading-[0.98] font-normal tracking-tight text-[#23201E]">
            {copy.heroTitlePrefix}{' '}
            <span className="italic text-[#6C8396]">{copy.heroTitleItalic}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#6B645E] sm:text-base">
            {copy.heroBody}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onStartBuilder}
              className="inline-flex items-center gap-2.5 rounded-sm bg-[#23201E] px-7 py-3.5 text-xs font-medium tracking-[0.14em] text-[#FAF7F2] uppercase shadow-[0_14px_30px_-10px_rgba(35,32,30,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6C8396] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C8396]"
            >
              <span>{copy.heroPrimaryCta}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onJumpConcierge}
              className="inline-flex items-center justify-center rounded-sm border border-[#D4C8B8] bg-white/85 px-7 py-3.5 text-xs font-medium tracking-[0.14em] text-[#23201E] uppercase backdrop-blur-xs transition-colors duration-200 hover:border-[#23201E] hover:bg-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C8396]"
            >
              {copy.heroSecondaryCta}
            </button>
          </div>
        </motion.div>

        {/* Multi-Plane Layered Editorial Product Composition */}
        <div className="relative mt-12 grid grid-cols-1 items-center gap-6 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          {/* Left Floating Offset Layer: Wicker Carriage */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `translate3d(${parallax.x * -0.45}px, ${parallax.y * -0.45}px, 0)`,
            }}
            className="relative transition-transform duration-300 ease-out lg:col-span-3 lg:mt-16"
          >
            <button
              type="button"
              onClick={() =>
                onQuickPreset({
                  styleId: 'wicker_carriage',
                  selectedPlushId: 'cream_teddy',
                  selectedOutfitId: null,
                  ribbonColor: 'dusty_blue',
                  balloonLine1: 'Louay',
                })
              }
              className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6C8396]"
            >
              <div className="overflow-hidden rounded-sm border border-white/90 bg-white p-2 shadow-[0_24px_48px_-18px_rgba(35,32,30,0.22)]">
                <div className="aspect-[3/4] w-full overflow-hidden bg-[#EFEAE2]">
                  <img
                    src="/assets/aistudio/image_0609d101.png"
                    alt={copy.heroCaptionLeft}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[#6B645E]">
                <span>01 · {copy.heroCaptionLeft}</span>
                <span className="text-[#23201E] transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </button>
          </motion.div>

          {/* Centerpiece Architectural Arch Anchor: Hat Box & Bunny + Floating Transparent Balloon */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.95, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `translate3d(${parallax.x * 0.25}px, ${parallax.y * 0.25}px, 0)`,
            }}
            className="relative transition-transform duration-300 ease-out lg:col-span-6"
          >
            {/* Floating Translucent Balloon Accent on Upper Left */}
            <motion.div
              animate={{ y: [-5, 6, -5] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute -top-6 -left-4 z-20 hidden sm:flex flex-col items-center"
              aria-hidden="true"
            >
              <div
                className="relative h-24 w-24 rounded-full border border-white/90 shadow-[0_18px_36px_-10px_rgba(108,131,150,0.28)]"
                style={{
                  background:
                    'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.88) 0%, rgba(232,198,201,0.24) 55%, rgba(108,131,150,0.24) 100%)',
                  backdropFilter: 'blur(3px)',
                }}
              >
                <div className="absolute top-3 left-4 h-7 w-4 -rotate-12 rounded-full bg-white/85 opacity-80" />
              </div>
              <svg viewBox="0 0 60 44" className="-mt-1 h-10 w-12">
                <path
                  d="M30 0 C22 15, 36 28, 26 42"
                  fill="none"
                  stroke="#CFA2A6"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>

            <button
              type="button"
              onClick={() =>
                onQuickPreset({
                  styleId: 'hatbox_bunny',
                  selectedPlushId: 'pink_bunny',
                  selectedOutfitId: null,
                  ribbonColor: 'blush_pink',
                  balloonLine1: 'Safiya',
                })
              }
              className="group relative block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6C8396]"
            >
              <div className="overflow-hidden rounded-t-[160px] rounded-b-sm border border-white/90 bg-white p-3 shadow-[0_36px_80px_-24px_rgba(35,32,30,0.28)] sm:rounded-t-[240px]">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-t-[150px] bg-[#EFEAE2] sm:rounded-t-[230px]">
                  <img
                    src="/assets/aistudio/image_4cf04c83.png"
                    alt={copy.heroCaptionCenter}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
              <div className="mt-3.5 flex items-center justify-between px-1 text-xs text-[#6B645E]">
                <span className="font-medium text-[#23201E]">{copy.heroCaptionCenter}</span>
                <span className="text-[#6C8396]">
                  {language === 'nl' ? 'Stel direct samen →' : 'Customise now →'}
                </span>
              </div>
            </button>

            {/* Floating Close-Up Detail Inset on Lower Right */}
            <motion.div
              animate={{ y: [4, -5, 4] }}
              transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute -right-4 bottom-12 z-20 hidden w-32 overflow-hidden rounded-sm border-2 border-white bg-white p-1.5 shadow-[0_20px_40px_-14px_rgba(35,32,30,0.28)] xl:block"
            >
              <img
                src="/assets/aistudio/image_4c97640e.png"
                alt={copy.heroCaptionDetail}
                referrerPolicy="no-referrer"
                className="aspect-square w-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Right Floating Offset Layer: Baby Outfit Balloon */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `translate3d(${parallax.x * 0.5}px, ${parallax.y * 0.5}px, 0)`,
            }}
            className="relative transition-transform duration-300 ease-out lg:col-span-3 lg:-mt-14"
          >
            <button
              type="button"
              onClick={() =>
                onQuickPreset({
                  styleId: 'outfit_balloon',
                  selectedPlushId: null,
                  selectedOutfitId: 'beige_romper',
                  ribbonColor: 'cream',
                  balloonLine1: 'Noussair',
                })
              }
              className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6C8396]"
            >
              <div className="overflow-hidden rounded-sm border border-white/90 bg-white p-2 shadow-[0_24px_48px_-18px_rgba(35,32,30,0.22)]">
                <div className="aspect-[3/4] w-full overflow-hidden bg-[#EFEAE2]">
                  <img
                    src="/assets/aistudio/image_33529fda.png"
                    alt={copy.heroCaptionRight}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[#6B645E]">
                <span>02 · {copy.heroCaptionRight}</span>
                <span className="text-[#23201E] transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
