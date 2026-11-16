import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { Language } from '../types';
import { UI_COPY } from '../data/translations';

interface FinalInvitationProps {
  language: Language;
  onStartBuilder: () => void;
}

export function FinalInvitation({ language, onStartBuilder }: FinalInvitationProps) {
  const copy = UI_COPY[language];

  return (
    <section className="relative overflow-hidden border-b border-[#485968] bg-gradient-to-br from-[#566A7B] via-[#4B5D6D] to-[#3B4A57] py-16 text-[#FAF7F2] lg:py-24">
      {/* Soft floating orb silhouette accent */}
      <motion.div
        animate={{ y: [-6, 8, -6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-12 right-12 hidden h-64 w-64 rounded-full border border-white/20 opacity-45 lg:block"
        style={{
          background:
            'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.06) 65%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1100px] px-4 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-medium tracking-[0.24em] text-[#E6DDD0] uppercase">
            {copy.finalEyebrow}
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl font-serif-display text-balance text-3xl font-normal text-[#FAF7F2] sm:text-5xl">
            {copy.finalTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#E3DCD1] sm:text-base">
            {copy.finalBody}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onStartBuilder}
              className="inline-flex items-center gap-2.5 rounded-sm bg-[#FAF7F2] px-7 py-3.5 text-xs font-medium tracking-[0.14em] text-[#23201E] uppercase shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-white whitespace-nowrap shrink-0"
            >
              <span>{copy.finalPrimaryCta}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <a
              href="https://www.instagram.com/ballonnette/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-sm border border-white/40 px-7 py-3.5 text-xs font-medium tracking-[0.14em] text-[#FAF7F2] uppercase transition-colors hover:border-white hover:bg-white/10 whitespace-nowrap shrink-0"
            >
              {copy.finalSecondaryCta}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
