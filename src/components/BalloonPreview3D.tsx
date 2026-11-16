import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, X } from 'lucide-react';
import type {
  BalloonTint,
  BuilderConfig,
  GiftStyleProduct,
  InsideOption,
  Language,
  RibbonColor,
  VinylColor,
  VinylFont,
} from '../types';
import { UI_COPY } from '../data/translations';

interface BalloonPreview3DProps {
  language: Language;
  config: BuilderConfig;
  selectedStyle: GiftStyleProduct;
  selectedPlush: InsideOption | null;
  selectedOutfit: InsideOption | null;
  estimatedTotalEur: number;
  onRemovePlush: () => void;
  onRemoveOutfit: () => void;
  onRemoveMoneygift: () => void;
  onRemoveOwnGift: () => void;
}

const RIBBON_PALETTE: Record<
  RibbonColor,
  { main: string; light: string; dark: string; name: { nl: string; en: string } }
> = {
  blush_pink: {
    main: '#CFA2A6',
    light: '#E8C9CC',
    dark: '#A67A7F',
    name: { nl: 'Blush Pink', en: 'Blush Pink' },
  },
  dusty_blue: {
    main: '#6C8396',
    light: '#94A9BA',
    dark: '#4D6274',
    name: { nl: 'Dusty Blue', en: 'Dusty Blue' },
  },
  cream: {
    main: '#E3D9C8',
    light: '#F4EFE6',
    dark: '#BFB29C',
    name: { nl: 'Crème', en: 'Cream' },
  },
  sage: {
    main: '#7E8E7A',
    light: '#A1B09D',
    dark: '#5D6C5A',
    name: { nl: 'Saliegroen', en: 'Sage' },
  },
};

const BALLOON_TINT_STYLE: Record<
  BalloonTint,
  { bg: string; innerGlow: string; label: { nl: string; en: string } }
> = {
  clear: {
    bg: 'radial-gradient(circle at 30% 24%, rgba(255,255,255,0.62) 0%, rgba(250,247,242,0.18) 48%, rgba(227,220,209,0.28) 82%, rgba(168,158,145,0.25) 100%)',
    innerGlow: 'inset 14px 16px 34px rgba(255,255,255,0.85), inset -16px -18px 34px rgba(108,131,150,0.16)',
    label: { nl: 'Kristalhelder', en: 'Crystal Clear' },
  },
  blush: {
    bg: 'radial-gradient(circle at 30% 24%, rgba(255,255,255,0.64) 0%, rgba(232,198,201,0.32) 48%, rgba(207,162,166,0.42) 84%, rgba(166,122,127,0.34) 100%)',
    innerGlow: 'inset 14px 16px 34px rgba(255,255,255,0.82), inset -16px -18px 34px rgba(166,122,127,0.24)',
    label: { nl: 'Zacht Blush', en: 'Soft Blush' },
  },
  dusty_blue: {
    bg: 'radial-gradient(circle at 30% 24%, rgba(255,255,255,0.64) 0%, rgba(186,204,219,0.28) 48%, rgba(108,131,150,0.38) 84%, rgba(77,98,116,0.30) 100%)',
    innerGlow: 'inset 14px 16px 34px rgba(255,255,255,0.82), inset -16px -18px 34px rgba(77,98,116,0.24)',
    label: { nl: 'Dusty Blue', en: 'Dusty Blue' },
  },
  champagne: {
    bg: 'radial-gradient(circle at 30% 24%, rgba(255,255,255,0.72) 0%, rgba(242,230,208,0.34) 48%, rgba(212,188,148,0.40) 84%, rgba(166,138,94,0.30) 100%)',
    innerGlow: 'inset 14px 16px 34px rgba(255,255,255,0.86), inset -16px -18px 34px rgba(185,151,104,0.24)',
    label: { nl: 'Champagne', en: 'Champagne' },
  },
};

const VINYL_STYLE: Record<VinylColor, { fill: string; stroke: string; label: string }> = {
  gold: { fill: 'url(#foilGold)', stroke: 'rgba(130, 96, 36, 0.25)', label: '#B99768' },
  white: { fill: '#FFFFFF', stroke: 'rgba(35, 32, 30, 0.16)', label: '#FFFFFF' },
  rose_gold: { fill: 'url(#foilRoseGold)', stroke: 'rgba(145, 92, 85, 0.24)', label: '#C78E86' },
};

const FONT_CLASS_MAP: Record<VinylFont, string> = {
  script: 'font-vinyl-script',
  serif: 'font-serif-display italic',
  sans: 'font-sans-body tracking-[0.14em] uppercase',
};

export function BalloonPreview3D({
  language,
  config,
  selectedStyle,
  selectedPlush,
  selectedOutfit,
  estimatedTotalEur,
  onRemovePlush,
  onRemoveOutfit,
  onRemoveMoneygift,
  onRemoveOwnGift,
}: BalloonPreview3DProps) {
  const copy = UI_COPY[language];
  const [anglePreset, setAnglePreset] = useState<'front' | 'left' | 'right'>('front');
  const [pointerTilt, setPointerTilt] = useState({ rx: 0, ry: 0 });

  const ribbon = RIBBON_PALETTE[config.ribbonColor];
  const tint = BALLOON_TINT_STYLE[config.balloonTint ?? 'clear'];
  const vinyl = VINYL_STYLE[config.vinylColor];

  const baseYaw = anglePreset === 'left' ? -14 : anglePreset === 'right' ? 14 : 0;
  const transform3D = `perspective(1100px) rotateX(${pointerTilt.rx}deg) rotateY(${baseYaw + pointerTilt.ry}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setPointerTilt({
      rx: Math.round(-ny * 8 * 10) / 10,
      ry: Math.round(nx * 10 * 10) / 10,
    });
  };

  const resetTilt = () => {
    setPointerTilt({ rx: 0, ry: 0 });
  };

  const isWickerCarriage = config.styleId === 'wicker_carriage';
  const isGenderReveal = config.styleId === 'gender_reveal';
  const isMoneyBasket = config.styleId === 'moneygift_balloon';
  const isOutfitBasket = config.styleId === 'outfit_balloon';

  const displayMainText =
    config.balloonLine1.trim() || (isGenderReveal ? "It's a..." : 'Ballonnette');
  const displaySubText = config.balloonLine2.trim();

  const hasAnyInside =
    Boolean(selectedPlush) ||
    Boolean(selectedOutfit) ||
    config.includeMoneygift ||
    config.includeOwnGift;

  return (
    <div className="rounded-sm border border-[#E3DCD1] bg-[#EFEAE2]/55 p-4 sm:p-6">
      {/* Stage Top Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium tracking-[0.14em] text-[#6B645E] uppercase">
            {selectedStyle.name[language]}
          </p>
          <p className="text-xs text-[#6B645E]">
            {tint.label[language]} · {ribbon.name[language]}
          </p>
        </div>

        {/* 3D Angle Controls */}
        <div
          className="flex items-center gap-1 rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] p-0.5 text-xs"
          role="group"
          aria-label="3D view angle"
        >
          {(['left', 'front', 'right'] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAnglePreset(preset)}
              className={`rounded-sm px-2.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
                anglePreset === preset
                  ? 'bg-[#23201E] text-[#FAF7F2]'
                  : 'text-[#6B645E] hover:text-[#23201E]'
              }`}
            >
              {preset === 'front'
                ? copy.previewFront
                : preset === 'left'
                ? copy.previewLeft
                : copy.previewRight}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive 2.5D / 3D Layered Composition Stage */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        className="relative flex min-h-[460px] w-full flex-col items-center justify-end overflow-hidden rounded-sm border border-[#E3DCD1] bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#E6DDD0] px-4 pt-8 pb-6 select-none sm:min-h-[520px]"
      >
        {/* Subtle Sunlit Sheer Curtain Daylight Backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-65"
          style={{
            background:
              'linear-gradient(115deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0) 44%, rgba(227,220,209,0.35) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute top-0 right-10 h-full w-24 opacity-25"
          style={{
            background:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 14px, transparent 14px, transparent 34px)',
          }}
        />

        {/* 3D Transform Scene */}
        <div
          className="relative z-10 flex flex-col items-center transition-transform duration-300 ease-out"
          style={{ transform: transform3D, transformStyle: 'preserve-3d' }}
        >
          {/* Floating Sphere / Canopy Container */}
          <div className="animate-float-gentle relative flex flex-col items-center">
            {/* Optional Mini Balloon Cluster on Upper Right */}
            <AnimatePresence>
              {config.addMiniBalloons && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.25 }}
                  className="pointer-events-none absolute -top-2 -right-11 z-20 flex flex-col items-center sm:-right-14"
                  style={{ transform: 'translateZ(26px)' }}
                  aria-hidden="true"
                >
                  <div className="relative h-24 w-24">
                    <div
                      className="absolute top-0 left-3 h-11 w-11 rounded-full shadow-md"
                      style={{
                        background: `radial-gradient(circle at 32% 28%, #FFFFFF 0%, ${ribbon.light} 48%, ${ribbon.main} 100%)`,
                      }}
                    />
                    <div
                      className="absolute top-5 right-1 h-12 w-12 rounded-full shadow-md"
                      style={{
                        background:
                          'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #F4EFE6 55%, #DFD4C3 100%)',
                      }}
                    />
                    <div
                      className="absolute top-11 left-1 h-10 w-10 rounded-full shadow-md"
                      style={{
                        background: `radial-gradient(circle at 32% 28%, #FFFFFF 0%, ${ribbon.main} 62%, ${ribbon.dark} 100%)`,
                      }}
                    />
                    <div
                      className="absolute top-6 left-6 h-7 w-7 rounded-full border border-white/60 shadow-sm"
                      style={{
                        background:
                          'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9) 0%, rgba(185,151,104,0.35) 100%)',
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Top Satin Bow */}
            <div
              className="relative z-30 -mb-4 flex flex-col items-center"
              style={{ transform: 'translateZ(36px)' }}
            >
              <svg viewBox="0 0 140 60" className="h-14 w-32 drop-shadow-md" aria-hidden="true">
                <defs>
                  <linearGradient id="bowGradL" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={ribbon.light} />
                    <stop offset="55%" stopColor={ribbon.main} />
                    <stop offset="100%" stopColor={ribbon.dark} />
                  </linearGradient>
                  <linearGradient id="bowGradR" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={ribbon.light} />
                    <stop offset="55%" stopColor={ribbon.main} />
                    <stop offset="100%" stopColor={ribbon.dark} />
                  </linearGradient>
                </defs>
                <path
                  d="M66 30 Q44 46 34 58 L46 57 Q56 44 68 32 Z"
                  fill={ribbon.dark}
                  opacity="0.88"
                />
                <path
                  d="M74 30 Q96 46 106 58 L94 57 Q84 44 72 32 Z"
                  fill={ribbon.main}
                  opacity="0.92"
                />
                <path
                  d="M68 26 C46 5, 16 7, 19 26 C21 40, 48 34, 68 26 Z"
                  fill="url(#bowGradL)"
                />
                <path
                  d="M72 26 C94 5, 124 7, 121 26 C119 40, 92 34, 72 26 Z"
                  fill="url(#bowGradR)"
                />
                <rect x="63" y="20" width="14" height="13" rx="5" fill={ribbon.dark} />
              </svg>
            </div>

            {/* Balloon Orb OR Wicker Carriage Floral Canopy */}
            {!isWickerCarriage ? (
              <div
                className="relative flex h-68 w-68 items-center justify-center overflow-hidden rounded-full border border-white/85 shadow-[0_26px_55px_-16px_rgba(35,32,30,0.22)] transition-all duration-300 sm:h-76 sm:w-76"
                style={{
                  background: isGenderReveal
                    ? 'radial-gradient(circle at 32% 26%, #FFFFFF 0%, #F7F2EA 38%, #E6DDD0 78%, #D4C8B8 100%)'
                    : tint.bg,
                }}
              >
                {/* Layered Inside Items (Visible inside clear/tinted orb) */}
                {!isGenderReveal && (
                  <div
                    className="relative z-10 flex h-full w-full flex-col items-center justify-end pb-3"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Fluffy Cotton Cloud Bed inside Balloon Bottom */}
                    <div
                      className="pointer-events-none absolute right-5 bottom-0 left-5 h-16 rounded-full bg-white/95 blur-[1px]"
                      style={{
                        boxShadow:
                          '-22px -6px 0 8px rgba(255,255,255,0.92), 22px -4px 0 10px rgba(255,255,255,0.92)',
                      }}
                    />

                    {/* Empty State Hint */}
                    {!hasAnyInside && (
                      <div className="relative z-10 mb-20 px-8 text-center">
                        <p className="font-serif-display text-lg italic text-[#6B645E]">
                          {copy.emptyBalloonPrompt}
                        </p>
                      </div>
                    )}

                    {/* LAYER A: Baby Outfit Display (Back / Upper Layer when paired, Center when solo) */}
                    <AnimatePresence>
                      {selectedOutfit && (
                        <motion.div
                          key={selectedOutfit.id}
                          initial={{ opacity: 0, scale: 0.85, y: 12 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.85, y: 12 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className={`absolute flex flex-col items-center ${
                            selectedPlush
                              ? 'top-10 right-6 z-10 h-38 w-38 sm:h-40 sm:w-40'
                              : 'bottom-6 z-10 h-48 w-48 sm:h-52 sm:w-52'
                          }`}
                          style={{
                            transform: selectedPlush
                              ? 'translateZ(8px) rotate(4deg)'
                              : 'translateZ(14px)',
                          }}
                        >
                          <div
                            className="relative h-full w-full overflow-hidden rounded-full border border-white/70 shadow-[0_12px_26px_rgba(35,32,30,0.16)]"
                            style={{
                              WebkitMaskImage:
                                'radial-gradient(circle, black 64%, transparent 100%)',
                              maskImage:
                                'radial-gradient(circle, black 64%, transparent 100%)',
                            }}
                          >
                            <img
                              src={selectedOutfit.imageUrl}
                              alt={selectedOutfit.name[language]}
                              referrerPolicy="no-referrer"
                              className="h-full w-full scale-110 object-cover object-center"
                            />
                          </div>
                          {selectedOutfit.id === 'name_onesie' && config.onesieName.trim() && (
                            <div className="pointer-events-none absolute inset-x-0 top-[44%] flex justify-center">
                              <span className="font-vinyl-script rounded bg-white/70 px-2 text-lg text-[#9D7C4E] shadow-xs backdrop-blur-[1px]">
                                {config.onesieName.trim()}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* LAYER B: Plush Companion (Foreground Seated on Clouds) */}
                    <AnimatePresence>
                      {selectedPlush && (
                        <motion.div
                          key={selectedPlush.id}
                          initial={{ opacity: 0, scale: 0.85, y: 14 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.85, y: 14 }}
                          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                          className={`relative z-20 transition-all duration-300 ${
                            selectedOutfit
                              ? 'mr-14 mb-4 h-40 w-40 sm:h-44 sm:w-44'
                              : 'mb-4 h-48 w-48 sm:h-52 sm:w-52'
                          }`}
                          style={{ transform: 'translateZ(20px)' }}
                        >
                          {/* Natural Contact Shadow on Clouds */}
                          <div className="pointer-events-none absolute right-6 -bottom-1 left-6 h-4 rounded-full bg-[#23201E]/18 blur-sm" />
                          <div
                            className="relative h-full w-full overflow-hidden rounded-full shadow-[0_10px_24px_rgba(35,32,30,0.16)]"
                            style={{
                              WebkitMaskImage:
                                'radial-gradient(circle at 50% 48%, black 58%, transparent 98%)',
                              maskImage:
                                'radial-gradient(circle at 50% 48%, black 58%, transparent 98%)',
                            }}
                          >
                            <img
                              src={selectedPlush.imageUrl}
                              alt={selectedPlush.name[language]}
                              referrerPolicy="no-referrer"
                              className="h-full w-full scale-110 object-cover object-center"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* LAYER C: Own Gift Parcel inside Dome */}
                    <AnimatePresence>
                      {config.includeOwnGift && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          className={`relative z-20 flex flex-col items-center ${
                            selectedPlush || selectedOutfit ? 'mb-2 scale-75' : 'mb-8'
                          }`}
                          style={{ transform: 'translateZ(22px)' }}
                        >
                          <div className="relative flex h-24 w-24 items-center justify-center rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] shadow-md">
                            <div
                              className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2"
                              style={{ backgroundColor: ribbon.main }}
                            />
                            <div
                              className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2"
                              style={{ backgroundColor: ribbon.main }}
                            />
                            <span className="relative z-10 rounded-xs bg-white/95 px-2 py-0.5 text-[10px] font-medium tracking-wider text-[#23201E] uppercase shadow-xs">
                              {language === 'nl' ? 'Eigen Cadeau' : 'Own Gift'}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* LAYER D: Moneygift Rolled Banknote Slots inside Orb when style is not woven money basket */}
                    <AnimatePresence>
                      {config.includeMoneygift && !isMoneyBasket && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="relative z-25 mb-2 flex flex-wrap justify-center gap-1 px-8"
                          style={{ transform: 'translateZ(24px)' }}
                        >
                          {Array.from({ length: Math.min(config.moneySlots, 12) }).map((_, idx) => (
                            <div
                              key={idx}
                              className="relative h-11 w-3 rounded-full border border-[#B8C8B6] bg-gradient-to-b from-[#EDF2EC] via-[#DCE6DB] to-[#C8D6C7] shadow-sm"
                            >
                              <div
                                className="absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2"
                                style={{ backgroundColor: ribbon.main }}
                              />
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Gender Reveal Opaque Pearl Inner Hint */}
                {isGenderReveal && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-44 w-44 rounded-full border border-[#B99768]/20" />
                  </div>
                )}

                {/* Specular Glass & Sunlit Window Reflections Overlay */}
                {!isGenderReveal && (
                  <>
                    <div
                      className="pointer-events-none absolute inset-0 z-30 rounded-full"
                      style={{ boxShadow: tint.innerGlow }}
                    />
                    <div
                      className="pointer-events-none absolute top-5 left-6 z-30 h-24 w-12 -rotate-[22deg] rounded-full opacity-75"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.08) 100%)',
                      }}
                    />
                    <div
                      className="pointer-events-none absolute top-10 right-6 z-30 h-28 w-10 rotate-[20deg] rounded-full opacity-35"
                      style={{
                        background:
                          'repeating-linear-gradient(180deg, rgba(255,255,255,0.85) 0px, rgba(255,255,255,0.85) 6px, transparent 6px, transparent 14px)',
                      }}
                    />
                  </>
                )}

                {/* Optional Gold Bunny & Butterfly Decal */}
                {config.addBunnyDecal && !isGenderReveal && (
                  <svg
                    viewBox="0 0 80 90"
                    className="pointer-events-none absolute top-8 right-8 z-30 h-16 w-14 opacity-90 drop-shadow-xs"
                    aria-hidden="true"
                  >
                    <path
                      d="M36 46 C31 32, 33 14, 39 14 C44 14, 44 30, 42 44 C48 45, 53 50, 52 57 C51 64, 46 68, 46 74 L30 74 C30 68, 26 62, 28 54 C29 48, 33 46, 36 46 Z"
                      fill="none"
                      stroke="#C9A56B"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M54 22 C60 15, 67 17, 65 24 C63 29, 57 28, 54 24 C51 28, 45 29, 43 24 C41 17, 48 15, 54 22 Z"
                      fill="rgba(207,162,166,0.45)"
                      stroke="#C9A56B"
                      strokeWidth="1.2"
                    />
                  </svg>
                )}

                {/* Curved Vinyl Typography SVG Overlay */}
                <svg
                  viewBox="0 0 300 300"
                  className="pointer-events-none absolute inset-0 z-40 h-full w-full"
                  style={{ transform: 'translateZ(28px)' }}
                >
                  <defs>
                    <linearGradient id="foilGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E6C987" />
                      <stop offset="45%" stopColor="#B99768" />
                      <stop offset="100%" stopColor="#8C6A35" />
                    </linearGradient>
                    <linearGradient id="foilRoseGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F0CEC8" />
                      <stop offset="50%" stopColor="#C9928B" />
                      <stop offset="100%" stopColor="#94625C" />
                    </linearGradient>
                    <path id="vinylArcTop" d="M 42,145 Q 150,108 258,145" />
                    <path id="vinylArcSub" d="M 52,186 Q 150,158 248,186" />
                  </defs>

                  <text
                    fill={vinyl.fill}
                    stroke={vinyl.stroke}
                    strokeWidth="0.6"
                    textAnchor="middle"
                    className={`${FONT_CLASS_MAP[config.vinylFont]} ${
                      config.vinylFont === 'script'
                        ? 'text-[38px]'
                        : config.vinylFont === 'serif'
                        ? 'text-[27px]'
                        : 'text-[19px] font-semibold'
                    }`}
                  >
                    <textPath href="#vinylArcTop" startOffset="50%">
                      {displayMainText.slice(0, 22)}
                    </textPath>
                  </text>

                  {displaySubText && (
                    <text
                      fill={vinyl.fill}
                      stroke={vinyl.stroke}
                      strokeWidth="0.4"
                      textAnchor="middle"
                      className="font-sans-body text-[13px] font-medium tracking-[0.08em]"
                    >
                      <textPath href="#vinylArcSub" startOffset="50%">
                        {displaySubText.slice(0, 28)}
                      </textPath>
                    </text>
                  )}
                </svg>

                {/* Trailing Long Satin Side Ribbons hugging the orb */}
                <div
                  className="animate-ribbon-sway pointer-events-none absolute top-4 left-2 z-30 h-48 w-3 origin-top rounded-full opacity-85"
                  style={{
                    background: `linear-gradient(180deg, ${ribbon.main}, ${ribbon.dark})`,
                    transform: 'rotate(12deg)',
                  }}
                />
                <div
                  className="animate-ribbon-sway pointer-events-none absolute top-4 right-2 z-30 h-48 w-3 origin-top rounded-full opacity-85"
                  style={{
                    background: `linear-gradient(180deg, ${ribbon.light}, ${ribbon.main})`,
                    transform: 'rotate(-12deg)',
                  }}
                />
              </div>
            ) : (
              /* Wicker Baby Carriage Floral Canopy + Live Plush / Outfit Inside */
              <div className="relative z-20 -mb-6 flex items-end justify-center">
                <div className="relative flex h-40 w-60 items-end justify-center overflow-hidden rounded-t-full border border-[#E3DCD1] bg-[#FAF7F2] shadow-md">
                  {selectedOutfit && (
                    <img
                      src={selectedOutfit.imageUrl}
                      alt={selectedOutfit.name[language]}
                      referrerPolicy="no-referrer"
                      className={`h-full w-full object-cover ${selectedPlush ? 'opacity-85' : ''}`}
                    />
                  )}
                  {selectedPlush && (
                    <img
                      src={selectedPlush.imageUrl}
                      alt={selectedPlush.name[language]}
                      referrerPolicy="no-referrer"
                      className={
                        selectedOutfit
                          ? 'absolute right-2 bottom-2 h-24 w-24 rounded-full border-2 border-white object-cover shadow-md'
                          : 'h-full w-full object-cover'
                      }
                    />
                  )}
                  {!selectedPlush && !selectedOutfit && (
                    <img
                      src="/src/assets/images/style_wicker_carriage_1794825464666.jpg"
                      alt={selectedStyle.name[language]}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  )}
                  {/* Hydrangea floral framing */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
                    style={{
                      background: `radial-gradient(circle at 20% 80%, ${ribbon.main} 0%, transparent 48%), radial-gradient(circle at 80% 80%, ${ribbon.light} 0%, transparent 50%)`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Optional Baby's Breath Sprigs at Seam */}
          {config.addBabysBreath && (
            <div
              className="pointer-events-none relative z-30 -my-3 flex items-center justify-center gap-16"
              aria-hidden="true"
            >
              {[0, 1].map((side) => (
                <div key={side} className="flex w-14 flex-wrap justify-center gap-1.5">
                  {Array.from({ length: 7 }).map((_, dot) => (
                    <span
                      key={dot}
                      className="h-2 w-2 rounded-full border border-[#D8D4C9] bg-white shadow-xs"
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Layer 1: Base / Vessel */}
          <div className="relative z-20 -mt-2 flex flex-col items-center">
            {config.styleId === 'hatbox_bunny' && (
              <div
                className="relative flex h-24 w-48 flex-col items-center justify-center rounded-b-lg border border-[#DDD3C3] shadow-lg"
                style={{
                  background: `radial-gradient(circle at 20% 30%, ${ribbon.light}44 3px, transparent 4px), radial-gradient(circle at 70% 60%, ${ribbon.main}44 3px, transparent 4px), linear-gradient(180deg, #F8F3EA 0%, #ECE2D2 100%)`,
                  backgroundSize: '26px 26px, 26px 26px, 100% 100%',
                }}
              >
                <div className="rounded-xs border border-[#C9A56B]/50 bg-[#FAF7F2]/90 px-4 py-1 text-[10px] font-medium tracking-[0.22em] text-[#23201E] uppercase">
                  BALLONNETTE
                </div>
                <div className="absolute -bottom-1.5 flex w-full justify-around overflow-hidden">
                  {Array.from({ length: 9 }).map((_, idx) => (
                    <span
                      key={idx}
                      className="h-3 w-5 rounded-b-full border-b border-[#DDD3C3] bg-[#ECE2D2]"
                    />
                  ))}
                </div>
              </div>
            )}

            {isMoneyBasket && (
              <div className="relative flex w-56 flex-col items-center">
                <div
                  className="mb-1 h-4 w-8 rounded-full shadow-xs"
                  style={{ backgroundColor: ribbon.main }}
                />
                <div
                  className="relative flex h-28 w-56 flex-col items-center justify-between overflow-hidden rounded-b-3xl border border-[#B99D78] px-3 pt-2 pb-3 shadow-lg"
                  style={{
                    background:
                      'repeating-linear-gradient(90deg, #C9AC84 0px, #C9AC84 10px, #B8986E 10px, #B8986E 12px), linear-gradient(180deg, #D5BA94 0%, #B08E63 100%)',
                    backgroundBlendMode: 'multiply',
                  }}
                >
                  {config.includeMoneygift ? (
                    <div className="flex flex-wrap justify-center gap-1">
                      {Array.from({ length: Math.min(config.moneySlots, 20) }).map((_, i) => (
                        <div
                          key={i}
                          className="relative h-9 w-2.5 rounded-t-sm border border-[#B8C8B6] bg-[#E8EFE7] shadow-xs"
                        >
                          <div
                            className="absolute inset-x-0 top-2.5 h-1"
                            style={{ backgroundColor: ribbon.main }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="mt-2 rounded-xs bg-[#FAF7F2]/85 px-2.5 py-0.5 text-[10px] font-medium text-[#23201E]">
                      {selectedPlush?.name[language] ?? selectedOutfit?.name[language] ?? 'Ballonnette'}
                    </span>
                  )}
                  <span className="rounded-xs bg-[#FAF7F2]/90 px-3 py-0.5 text-[10px] font-medium tracking-[0.15em] text-[#23201E] uppercase">
                    {config.includeMoneygift ? `${config.moneySlots} ${copy.slotsUnit}` : 'Ballonnette'}
                  </span>
                </div>
              </div>
            )}

            {isOutfitBasket && (
              <div className="relative flex w-56 flex-col items-center">
                <div
                  className="relative z-10 h-16 w-56 rounded-t-xl rounded-b-2xl border border-[#DFD6C7] shadow-md"
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, rgba(215,204,188,0.35) 25%, transparent 25%), linear-gradient(-45deg, rgba(215,204,188,0.35) 25%, transparent 25%)',
                    backgroundSize: '10px 10px',
                    backgroundColor: '#F5F0E7',
                  }}
                >
                  <div className="flex h-full items-center justify-center">
                    <span className="rounded-xs border border-[#E3DCD1] bg-white/80 px-3 py-0.5 text-[10px] tracking-[0.18em] text-[#6B645E] uppercase">
                      {selectedOutfit ? `Maat ${config.outfitSize}` : 'Atelier Knit'}
                    </span>
                  </div>
                </div>
                <div className="h-6 w-44 rounded-b-2xl border border-[#C3A67F] bg-[#C8AB82] shadow-md" />
              </div>
            )}

            {isWickerCarriage && (
              <div className="relative flex flex-col items-center">
                <div
                  className="relative flex h-28 w-60 items-center justify-center rounded-b-[42px] rounded-tl-xl rounded-tr-3xl border border-[#B99D78] shadow-lg"
                  style={{
                    background:
                      'repeating-linear-gradient(0deg, #C9AC84 0px, #C9AC84 8px, #B49368 8px, #B49368 10px)',
                  }}
                >
                  <div className="relative z-20 flex flex-col items-center">
                    <div
                      className="h-3.5 w-12 rounded-full shadow-xs"
                      style={{ backgroundColor: ribbon.main }}
                    />
                    <div
                      className="mt-1 flex h-14 w-14 flex-col items-center justify-center rounded-full border border-white/60 shadow-md"
                      style={{ backgroundColor: ribbon.main }}
                    >
                      <span
                        className="font-vinyl-script text-sm leading-none"
                        style={{ color: vinyl.label }}
                      >
                        {displayMainText.slice(0, 12)}
                      </span>
                      {displaySubText && (
                        <span
                          className="mt-0.5 text-[7px] tracking-wider"
                          style={{ color: vinyl.label }}
                        >
                          {displaySubText.slice(0, 10)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="-mt-2 flex w-44 items-center justify-between px-3">
                  {[0, 1].map((w) => (
                    <div
                      key={w}
                      className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#B99A72] bg-[#DFC59E] shadow-md"
                    >
                      <div className="h-2.5 w-2.5 rounded-full bg-[#8D7350]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isGenderReveal && (
              <div className="relative flex flex-col items-center">
                <div className="h-4 w-12 rounded-b-sm bg-[#E6DDD0]" />
                <div className="flex h-16 w-36 items-center justify-center rounded-sm border border-[#DDD3C3] bg-gradient-to-b from-[#FAF7F2] to-[#E8DFD2] shadow-md">
                  <span className="text-[10px] font-medium tracking-[0.2em] text-[#6B645E] uppercase">
                    Boy or Girl
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 h-4 w-56 rounded-full bg-[#23201E]/12 blur-md" />
        </div>

        {(anglePreset !== 'front' || pointerTilt.rx !== 0 || pointerTilt.ry !== 0) && (
          <button
            type="button"
            onClick={() => {
              setAnglePreset('front');
              resetTilt();
            }}
            className="absolute right-3 bottom-3 z-20 inline-flex items-center gap-1 rounded-sm border border-[#E3DCD1] bg-[#FAF7F2]/90 px-2.5 py-1 text-[11px] text-[#6B645E] transition-colors hover:text-[#23201E]"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Active Inside Layers Tray with Instant Remove Controls */}
      <div className="mt-4 border-t border-[#E3DCD1] pt-3">
        <p className="mb-2 text-[11px] font-medium tracking-[0.12em] text-[#6B645E] uppercase">
          {copy.activeLayersTitle}
        </p>
        <div className="flex flex-wrap gap-2">
          {selectedPlush && (
            <button
              type="button"
              onClick={onRemovePlush}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#E3DCD1] bg-white px-2.5 py-1 text-xs text-[#23201E] transition-colors hover:border-[#9E524E] hover:text-[#9E524E]"
              title={copy.removeBtn}
            >
              <span>{selectedPlush.name[language]}</span>
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
          {selectedOutfit && (
            <button
              type="button"
              onClick={onRemoveOutfit}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#E3DCD1] bg-white px-2.5 py-1 text-xs text-[#23201E] transition-colors hover:border-[#9E524E] hover:text-[#9E524E]"
              title={copy.removeBtn}
            >
              <span>
                {selectedOutfit.name[language]} ({config.outfitSize})
              </span>
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
          {config.includeMoneygift && (
            <button
              type="button"
              onClick={onRemoveMoneygift}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#E3DCD1] bg-white px-2.5 py-1 text-xs text-[#23201E] transition-colors hover:border-[#9E524E] hover:text-[#9E524E]"
              title={copy.removeBtn}
            >
              <span>
                {config.moneySlots} {copy.slotsUnit}
              </span>
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
          {config.includeOwnGift && (
            <button
              type="button"
              onClick={onRemoveOwnGift}
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#E3DCD1] bg-white px-2.5 py-1 text-xs text-[#23201E] transition-colors hover:border-[#9E524E] hover:text-[#9E524E]"
              title={copy.removeBtn}
            >
              <span>{copy.catOwnGift}</span>
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
          {!hasAnyInside && (
            <span className="text-xs italic text-[#6B645E]">{copy.emptyBalloonPrompt}</span>
          )}
        </div>
      </div>

      {/* Live Spec & Price Readout */}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-[#E3DCD1] pt-4">
        <div className="space-y-0.5 text-xs text-[#6B645E]">
          <div>
            {language === 'nl' ? 'Vinyl' : 'Vinyl'}:{' '}
            <strong className="font-medium text-[#23201E]">
              {config.vinylColor === 'gold'
                ? 'Gold'
                : config.vinylColor === 'rose_gold'
                ? 'Rose Gold'
                : 'White'}
            </strong>
            {' · '}
            {language === 'nl' ? 'Lint' : 'Ribbon'}:{' '}
            <strong className="font-medium text-[#23201E]">{ribbon.name[language]}</strong>
          </div>
          {config.includeMoneygift && (
            <p className="text-[#6C8396]">{copy.previewMoneyNote}</p>
          )}
        </div>

        <div className="text-right">
          <p className="text-[11px] tracking-[0.12em] text-[#6B645E] uppercase">
            {copy.previewEstimatedTotal}
          </p>
          <p className="font-serif-display text-3xl font-medium text-[#23201E] tabular-nums">
            €{estimatedTotalEur.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-[11px] text-[#6B645E]">{copy.previewPlusShipping}</p>
        </div>
      </div>
    </div>
  );
}
