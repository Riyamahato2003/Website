import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, X, ArrowRight } from 'lucide-react';
import type { BuilderConfig, GalleryMediaItem, Language } from '../types';
import { AUTHENTIC_GALLERY_ITEMS, THREE_ATELIER_REELS } from '../data/catalogDefaults';
import { UI_COPY } from '../data/translations';

interface GalleryShowcaseProps {
  language: Language;
  onSelectPreset: (patch: Partial<BuilderConfig>) => void;
}

export function GalleryShowcase({ language, onSelectPreset }: GalleryShowcaseProps) {
  const copy = UI_COPY[language];
  const [activeModal, setActiveModal] = useState<GalleryMediaItem | null>(null);

  const photoItems = AUTHENTIC_GALLERY_ITEMS.filter((item) => item.type === 'image');

  const applyGalleryPreset = (item: GalleryMediaItem) => {
    onSelectPreset({
      styleId: item.presetStyleId,
      selectedPlushId: item.presetPlushId,
      selectedOutfitId: item.presetOutfitId,
      includeMoneygift: Boolean(item.presetMoneygift),
      includeOwnGift: false,
      ribbonColor: item.presetRibbon,
      balloonTint: item.presetTint ?? 'clear',
      balloonLine1: item.presetText,
    });
    setActiveModal(null);
  };

  return (
    <section id="gallery" className="border-b border-[#E3DCD1] bg-[#FAF7F2] py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        {/* Section Header */}
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-medium tracking-[0.2em] text-[#6C8396] uppercase">
            {copy.galleryEyebrow}
          </p>
          <h2 className="mt-2 font-serif-display text-balance text-3xl font-normal text-[#23201E] sm:text-4xl">
            {copy.galleryTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#6B645E]">
            {copy.gallerySubtitle}
          </p>
        </div>

        {/* Dedicated 3-Video Editorial Showcase (Requirement 2) */}
        <div className="mb-14">
          <div className="mb-5 flex items-center justify-between border-b border-[#E3DCD1] pb-3">
            <h3 className="font-serif-display text-2xl font-normal text-[#23201E]">
              {copy.reelsHeading}
            </h3>
            <span className="text-xs text-[#6B645E]">@ballonnette · Reels</span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {THREE_ATELIER_REELS.map((reel, idx) => (
              <motion.article
                key={reel.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col overflow-hidden rounded-sm border border-[#E3DCD1] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Exact 9:16 Vertical Frame — zero stretching or awkward cropping */}
                <button
                  type="button"
                  onClick={() => setActiveModal(reel)}
                  className="relative aspect-[9/16] w-full overflow-hidden bg-[#EFEAE2] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C8396]"
                >
                  <video
                    src={reel.src}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                  <div className="pointer-events-none absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#23201E] shadow-md transition-transform duration-200 group-hover:scale-105">
                    <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                  </div>
                </button>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <p className="text-[11px] tracking-[0.14em] text-[#6B645E] uppercase">
                      Atelier Reel · 0{idx + 1}
                    </p>
                    <h4 className="mt-1 font-serif-display text-xl font-normal text-[#23201E]">
                      {reel.title[language]}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#6B645E]">
                      {reel.caption[language]}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-[#E3DCD1] pt-3">
                    <button
                      type="button"
                      onClick={() => applyGalleryPreset(reel)}
                      className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.1em] text-[#23201E] uppercase transition-colors hover:text-[#6C8396]"
                    >
                      <span>{copy.galleryLoadPreset}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Atelier Photo Archive Grid */}
        <div>
          <div className="mb-5 flex items-center justify-between border-b border-[#E3DCD1] pb-3">
            <h3 className="font-serif-display text-2xl font-normal text-[#23201E]">
              {copy.archiveHeading}
            </h3>
            <span className="text-xs text-[#6B645E]">6 {language === 'nl' ? 'creaties' : 'pieces'}</span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photoItems.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-sm border border-[#E3DCD1] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setActiveModal(item)}
                  className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFEAE2] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C8396]"
                >
                  <img
                    src={item.src}
                    alt={item.title[language]}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </button>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <p className="text-[11px] tracking-[0.14em] text-[#6B645E] uppercase">
                      Atelier Archive
                    </p>
                    <h4 className="mt-1 font-serif-display text-xl font-normal text-[#23201E]">
                      {item.title[language]}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#6B645E]">
                      {item.caption[language]}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-[#E3DCD1] pt-3">
                    <button
                      type="button"
                      onClick={() => applyGalleryPreset(item)}
                      className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.1em] text-[#23201E] uppercase transition-colors hover:text-[#6C8396]"
                    >
                      <span>{copy.galleryLoadPreset}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#23201E]/75 p-4 backdrop-blur-xs"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative grid max-h-[90vh] w-full max-w-4xl grid-cols-1 overflow-hidden rounded-sm bg-[#FAF7F2] shadow-2xl md:grid-cols-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              aria-label="Close"
              className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#23201E] shadow-sm hover:bg-white"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="flex items-center justify-center bg-[#EFEAE2] md:col-span-7">
              {activeModal.type === 'image' ? (
                <img
                  src={activeModal.src}
                  alt={activeModal.title[language]}
                  referrerPolicy="no-referrer"
                  className="max-h-[80vh] w-full object-contain"
                />
              ) : (
                <video
                  src={activeModal.src}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="max-h-[80vh] w-full object-contain"
                />
              )}
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 md:col-span-5">
              <div>
                <p className="text-xs tracking-[0.16em] text-[#6C8396] uppercase">
                  Ballonnette · @ballonnette
                </p>
                <h3 className="mt-2 font-serif-display text-3xl text-[#23201E]">
                  {activeModal.title[language]}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6B645E]">
                  {activeModal.caption[language]}
                </p>
              </div>

              <button
                type="button"
                onClick={() => applyGalleryPreset(activeModal)}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm bg-[#23201E] px-5 py-3.5 text-xs font-medium tracking-[0.12em] text-[#FAF7F2] uppercase transition-colors hover:bg-[#6C8396]"
              >
                <span>{copy.galleryLoadPreset}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
