import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type {
  BuilderConfig,
  GiftStyleProduct,
  InsideOption,
  Language,
} from '../types';
import {
  type ConciergeAnswers,
  DEFAULT_BUILDER_CONFIG,
  computeDemoTotalEur,
  runRulesConcierge,
} from '../data/catalogDefaults';
import { UI_COPY } from '../data/translations';

interface GiftConciergeProps {
  language: Language;
  styles: GiftStyleProduct[];
  insideOptions: InsideOption[];
  onApplyRecommendation: (patch: Partial<BuilderConfig>) => void;
}

export function GiftConcierge({
  language,
  styles,
  insideOptions,
  onApplyRecommendation,
}: GiftConciergeProps) {
  const copy = UI_COPY[language];
  const [answers, setAnswers] = useState<ConciergeAnswers>({
    occasion: 'newborn',
    budget: '75_to_95',
    palette: 'dusty_blue',
  });

  const recommendations = useMemo(() => runRulesConcierge(answers), [answers]);

  const answerKey = `${answers.occasion}-${answers.budget}-${answers.palette}`;

  const getEstimatedRecPrice = (patch: Partial<BuilderConfig>) => {
    const merged: BuilderConfig = {
      ...DEFAULT_BUILDER_CONFIG,
      ...patch,
    };
    return computeDemoTotalEur(merged, styles, insideOptions);
  };

  return (
    <section
      id="concierge"
      className="relative overflow-hidden border-b border-[#E3DCD1] bg-[#EFEAE2]/70 py-16 lg:py-24"
    >
      {/* Subtle Boutique Product Backdrop Collage */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]">
        <div className="mx-auto grid h-full max-w-[1440px] grid-cols-3 gap-6 px-6 py-8">
          <img
            src="/assets/aistudio/image_a9f32b2a.png"
            alt=""
            className="h-full w-full rounded-sm object-cover"
          />
          <img
            src="/assets/aistudio/image_4c97640e.png"
            alt=""
            className="h-full w-full rounded-sm object-cover"
          />
          <img
            src="/assets/aistudio/image_33529fda.png"
            alt=""
            className="h-full w-full rounded-sm object-cover"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-8">
        {/* Section Header + Atelier Visual Vignette */}
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[#E3DCD1] pb-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.2em] text-[#6C8396] uppercase">
              {copy.conciergeEyebrow}
            </p>
            <h2 className="mt-2 font-serif-display text-balance text-3xl font-normal text-[#23201E] sm:text-4xl">
              {copy.conciergeTitle}
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[#6B645E] sm:text-base">
              {copy.conciergeSubtitle}
            </p>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {[
              '/src/assets/images/inside_cream_bunny_1794830278514.jpg',
              '/src/assets/images/inside_knit_cardigan_set_1794830279812.jpg',
              '/src/assets/images/inside_moneygift_rolls_1794825467929.jpg',
            ].map((thumb, idx) => (
              <div
                key={idx}
                className="h-16 w-16 overflow-hidden rounded-sm border border-white/90 bg-white p-1 shadow-sm"
              >
                <img
                  src={thumb}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Interactive Visual 3-Question Selector */}
          <div className="space-y-7 rounded-sm border border-[#E3DCD1] bg-[#FAF7F2]/95 p-6 shadow-sm backdrop-blur-xs sm:p-8 lg:col-span-6">
            {/* Q1: Visual Occasion Cards */}
            <div>
              <p className="text-xs font-medium tracking-wide text-[#23201E] uppercase">
                {copy.conciergeQ1}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {(
                  [
                    {
                      id: 'newborn',
                      nl: 'Geboorte',
                      en: 'Newborn',
                      img: '/src/assets/images/style_outfit_balloon_1794825464531.jpg',
                    },
                    {
                      id: 'baby_shower',
                      nl: 'Babyshower',
                      en: 'Baby Shower',
                      img: '/src/assets/images/style_hatbox_bunny_1794825464514.jpg',
                    },
                    {
                      id: 'gender_reveal',
                      nl: 'Gender Reveal',
                      en: 'Gender Reveal',
                      img: '/src/assets/images/style_gender_reveal_1794825466297.jpg',
                    },
                    {
                      id: 'birthday',
                      nl: 'Verjaardag & Geld',
                      en: 'Birthday & Money',
                      img: '/src/assets/images/style_moneygift_balloon_1794825465901.jpg',
                    },
                  ] as const
                ).map((item) => {
                  const active = answers.occasion === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAnswers((p) => ({ ...p, occasion: item.id }))}
                      className={`flex items-center gap-3 rounded-sm border p-2.5 text-left transition-all duration-200 ${
                        active
                          ? 'border-[#23201E] bg-white shadow-xs'
                          : 'border-[#E3DCD1] bg-white/70 hover:border-[#B99768]'
                      }`}
                    >
                      <img
                        src={item.img}
                        alt={item[language]}
                        referrerPolicy="no-referrer"
                        className="h-11 w-11 shrink-0 rounded-xs object-cover"
                      />
                      <span
                        className={`text-xs font-medium ${
                          active ? 'text-[#23201E]' : 'text-[#6B645E]'
                        }`}
                      >
                        {item[language]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Q2: Budget */}
            <div>
              <p className="text-xs font-medium tracking-wide text-[#23201E] uppercase">
                {copy.conciergeQ2}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {(
                  [
                    {
                      id: 'under_75',
                      nl: 'Tot €75',
                      en: 'Up to €75',
                      sub: { nl: 'Subtiel', en: 'Essential' },
                    },
                    {
                      id: '75_to_95',
                      nl: '€75 – €95',
                      en: '€75 – €95',
                      sub: { nl: 'Populair', en: 'Signature' },
                    },
                    {
                      id: '95_plus',
                      nl: '€95+ Deluxe',
                      en: '€95+ Deluxe',
                      sub: { nl: 'Uitgebreid', en: 'Grand' },
                    },
                  ] as const
                ).map((item) => {
                  const active = answers.budget === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAnswers((p) => ({ ...p, budget: item.id }))}
                      className={`flex flex-col rounded-sm border px-3.5 py-3 text-left transition-colors ${
                        active
                          ? 'border-[#23201E] bg-[#23201E] text-[#FAF7F2]'
                          : 'border-[#E3DCD1] bg-white text-[#23201E] hover:border-[#B99768]'
                      }`}
                    >
                      <span className="text-xs font-medium tabular-nums">{item[language]}</span>
                      <span
                        className={`mt-0.5 text-[11px] ${
                          active ? 'text-[#E3DCD1]' : 'text-[#6B645E]'
                        }`}
                      >
                        {item.sub[language]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Q3: Palette Theme */}
            <div>
              <p className="text-xs font-medium tracking-wide text-[#23201E] uppercase">
                {copy.conciergeQ3}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {(
                  [
                    {
                      id: 'dusty_blue',
                      label: 'Dusty Blue Serenity',
                      swatch1: '#6C8396',
                      swatch2: '#FAF7F2',
                    },
                    {
                      id: 'blush_pink',
                      label: 'Blush Pink Romance',
                      swatch1: '#CFA2A6',
                      swatch2: '#F5E6E7',
                    },
                    {
                      id: 'champagne_cream',
                      label: 'Champagne & Crème',
                      swatch1: '#B99768',
                      swatch2: '#EFEAE2',
                    },
                    {
                      id: 'sage_ivory',
                      label: 'Sage & Warm Ivory',
                      swatch1: '#7E8E7A',
                      swatch2: '#FAF7F2',
                    },
                  ] as const
                ).map((item) => {
                  const active = answers.palette === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAnswers((p) => ({ ...p, palette: item.id }))}
                      className={`flex items-center gap-3 rounded-sm border px-3.5 py-2.5 text-left text-xs font-medium transition-colors ${
                        active
                          ? 'border-[#23201E] bg-white text-[#23201E] shadow-xs'
                          : 'border-[#E3DCD1] bg-white/75 text-[#6B645E] hover:border-[#B99768]'
                      }`}
                    >
                      <span className="flex shrink-0 -space-x-1.5">
                        <span
                          className="h-4 w-4 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: item.swatch1 }}
                        />
                        <span
                          className="h-4 w-4 rounded-full border border-[#E3DCD1] shadow-xs"
                          style={{ backgroundColor: item.swatch2 }}
                        />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Animated Luxury Gift Preview Cards */}
          <div className="space-y-4 lg:col-span-6">
            <p className="text-xs font-medium tracking-[0.16em] text-[#6B645E] uppercase">
              {copy.conciergeResultTitle}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={answerKey}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {recommendations.map((rec, idx) => {
                  const demoPrice = getEstimatedRecPrice(rec.patch);
                  return (
                    <div
                      key={idx}
                      className="group grid grid-cols-1 overflow-hidden rounded-sm border border-[#E3DCD1] bg-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-12"
                    >
                      {/* Photorealistic Dual Preview */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#EFEAE2] sm:col-span-5 sm:aspect-auto sm:min-h-[210px]">
                        <img
                          src={rec.imageUrl}
                          alt={rec.title[language]}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                        <div className="absolute right-2.5 bottom-2.5 h-14 w-14 overflow-hidden rounded-sm border-2 border-white bg-white shadow-md">
                          <img
                            src={rec.secondaryImageUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Editorial Spec & CTA */}
                      <div className="flex flex-col justify-between p-5 sm:col-span-7">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-medium tracking-[0.14em] text-[#B99768] uppercase">
                              0{idx + 1} · {language === 'nl' ? 'Atelier Voorstel' : 'Atelier Pairing'}
                            </span>
                            <span className="font-serif-display text-xl font-medium text-[#23201E] tabular-nums">
                              €{demoPrice}
                            </span>
                          </div>
                          <h3 className="mt-1.5 font-serif-display text-2xl font-normal text-[#23201E]">
                            {rec.title[language]}
                          </h3>
                          <p className="mt-2 text-xs leading-relaxed text-[#6B645E]">
                            {rec.rationale[language]}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-[#E3DCD1] pt-3">
                          <span className="text-[11px] text-[#6B645E]">
                            {rec.patch.ribbonColor?.replace('_', ' ')} · {rec.patch.vinylColor}
                          </span>
                          <button
                            type="button"
                            onClick={() => onApplyRecommendation(rec.patch)}
                            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.12em] text-[#23201E] uppercase transition-colors hover:text-[#6C8396]"
                          >
                            <span>{copy.conciergeApplyBtn}</span>
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
