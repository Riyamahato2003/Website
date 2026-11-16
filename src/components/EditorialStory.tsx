import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { BuilderConfig, Language } from '../types';
import { UI_COPY } from '../data/translations';

interface EditorialStoryProps {
  language: Language;
  onSelectCollection: (patch: Partial<BuilderConfig>) => void;
}

export function EditorialStory({ language, onSelectCollection }: EditorialStoryProps) {
  const copy = UI_COPY[language];

  const featuredCollections: {
    label: string;
    img: string;
    patch: Partial<BuilderConfig>;
  }[] = [
    {
      label: copy.storyCol1,
      img: '/src/assets/images/style_hatbox_bunny_1794825464514.jpg',
      patch: {
        styleId: 'hatbox_bunny',
        selectedPlushId: 'pink_bunny',
        selectedOutfitId: null,
        includeMoneygift: false,
        ribbonColor: 'blush_pink',
      },
    },
    {
      label: copy.storyCol2,
      img: '/src/assets/images/style_wicker_carriage_1794825464666.jpg',
      patch: {
        styleId: 'wicker_carriage',
        selectedPlushId: 'cream_teddy',
        selectedOutfitId: null,
        includeMoneygift: false,
        ribbonColor: 'dusty_blue',
      },
    },
    {
      label: copy.storyCol3,
      img: '/src/assets/images/style_moneygift_balloon_1794825465901.jpg',
      patch: {
        styleId: 'moneygift_balloon',
        selectedPlushId: 'cream_teddy',
        selectedOutfitId: null,
        includeMoneygift: true,
        ribbonColor: 'dusty_blue',
      },
    },
    {
      label: copy.storyCol4,
      img: '/src/assets/images/style_outfit_balloon_1794825464531.jpg',
      patch: {
        styleId: 'outfit_balloon',
        selectedPlushId: null,
        selectedOutfitId: 'knit_cardigan_set',
        includeMoneygift: false,
        ribbonColor: 'cream',
      },
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-[#3A3531] bg-[#23201E] py-16 text-[#FAF7F2] lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Layered Authentic Atelier Photography */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative grid grid-cols-12 items-end gap-4 lg:col-span-6"
          >
            <div className="col-span-7 overflow-hidden rounded-sm border border-[#B99768]/30 bg-[#2E2A27] p-2 shadow-2xl">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  src="/assets/aistudio/image_a9f32b2a.png"
                  alt="Gepersonaliseerde geldcadeau ballon met gouden kalligrafie"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="col-span-5 mb-8 overflow-hidden rounded-sm border border-[#B99768]/30 bg-[#2E2A27] p-2 shadow-2xl">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  src="/assets/aistudio/image_257424b0.png"
                  alt="Dusty blue en ivoor ballonnenwolk met teddybeer"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Editorial Craftsmanship Chapters */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 lg:col-span-6"
          >
            <div>
              <p className="text-xs font-medium tracking-[0.22em] text-[#B99768] uppercase">
                {copy.storyEyebrow}
              </p>
              <h2 className="mt-3 font-serif-display text-balance text-3xl leading-[1.08] font-normal text-[#FAF7F2] sm:text-4xl lg:text-[2.75rem]">
                {copy.storyTitle}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#D8D0C5] sm:text-base">
                {copy.storySubtitle}
              </p>
            </div>

            <div className="divide-y divide-[#3A3531] border-y border-[#3A3531]">
              <div className="py-4">
                <h3 className="font-serif-display text-xl text-[#FAF7F2]">
                  {copy.storyPillar1Title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#C9BFB2]">
                  {copy.storyPillar1Body}
                </p>
              </div>
              <div className="py-4">
                <h3 className="font-serif-display text-xl text-[#FAF7F2]">
                  {copy.storyPillar2Title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#C9BFB2]">
                  {copy.storyPillar2Body}
                </p>
              </div>
              <div className="py-4">
                <h3 className="font-serif-display text-xl text-[#FAF7F2]">
                  {copy.storyPillar3Title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#C9BFB2]">
                  {copy.storyPillar3Body}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured Collections Interactive Editorial Bar */}
        <div className="mt-14 border-t border-[#3A3531] pt-10">
          <p className="mb-5 text-xs font-medium tracking-[0.18em] text-[#B99768] uppercase">
            {copy.storyCollectionsLabel}
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featuredCollections.map((col, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectCollection(col.patch)}
                className="group flex items-center gap-3.5 rounded-sm border border-[#3A3531] bg-[#2B2724] p-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B99768]"
              >
                <img
                  src={col.img}
                  alt={col.label}
                  referrerPolicy="no-referrer"
                  className="h-14 w-14 shrink-0 rounded-xs object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif-display text-base text-[#FAF7F2]">
                    {col.label}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#B99768] transition-transform group-hover:translate-x-0.5">
                    <span>3D Studio</span>
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
