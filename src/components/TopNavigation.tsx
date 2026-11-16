import type { Language } from '../types';
import { UI_COPY } from '../data/translations';

interface TopNavigationProps {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  onOpenAdmin: () => void;
}

export function TopNavigation({
  language,
  onChangeLanguage,
  onOpenAdmin,
}: TopNavigationProps) {
  const copy = UI_COPY[language];

  return (
    <div className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md">
      {/* Slim Atelier Utility Strip (<= 36px) */}
      <div className="border-b border-[#E3DCD1] bg-[#EFEAE2]/80">
        <div className="mx-auto flex h-9 max-w-[1280px] items-center justify-between gap-4 px-4 text-xs text-[#6B645E] sm:px-8">
          <div className="flex min-w-0 items-center gap-2 truncate">
            <span className="truncate">{copy.topStripInfo}</span>
            <span className="hidden text-[#B99768] sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline">{copy.topStripDemo}</span>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <div
              className="flex items-center gap-1 text-xs"
              role="group"
              aria-label="Language switch"
            >
              <button
                type="button"
                onClick={() => onChangeLanguage('nl')}
                className={`px-1.5 py-0.5 transition-colors whitespace-nowrap shrink-0 ${
                  language === 'nl'
                    ? 'font-semibold text-[#23201E] underline decoration-[#B99768] underline-offset-4'
                    : 'text-[#6B645E] hover:text-[#23201E]'
                }`}
              >
                NL
              </button>
              <span className="text-[#E3DCD1]" aria-hidden="true">/</span>
              <button
                type="button"
                onClick={() => onChangeLanguage('en')}
                className={`px-1.5 py-0.5 transition-colors whitespace-nowrap shrink-0 ${
                  language === 'en'
                    ? 'font-semibold text-[#23201E] underline decoration-[#B99768] underline-offset-4'
                    : 'text-[#6B645E] hover:text-[#23201E]'
                }`}
              >
                EN
              </button>
            </div>

            <span className="text-[#E3DCD1]" aria-hidden="true">|</span>

            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-xs font-medium text-[#6B645E] transition-colors hover:text-[#23201E] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C8396]"
            >
              {copy.adminBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Strict 3-Zone Top Bar */}
      <header className="border-b border-[#E3DCD1]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-4 py-4 sm:px-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#top"
            className="font-serif-display text-2xl font-medium tracking-[0.14em] text-[#23201E] whitespace-nowrap shrink-0"
          >
            BALLONNETTE
          </a>

          {/* Zone 2: Clean single-line navigation links */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B645E]"
            aria-label="Primary"
          >
            <a
              href="#gallery"
              className="transition-colors hover:text-[#23201E] whitespace-nowrap shrink-0"
            >
              {copy.navCollection}
            </a>
            <a
              href="#studio"
              className="transition-colors hover:text-[#23201E] whitespace-nowrap shrink-0"
            >
              {copy.navStudio}
            </a>
            <a
              href="#concierge"
              className="transition-colors hover:text-[#23201E] whitespace-nowrap shrink-0"
            >
              {copy.navConcierge}
            </a>
            <a
              href="#atelier"
              className="transition-colors hover:text-[#23201E] whitespace-nowrap shrink-0"
            >
              {copy.navAtelier}
            </a>
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="shrink-0">
            <a
              href="#studio"
              className="inline-flex items-center justify-center rounded-sm bg-[#23201E] px-5 py-2.5 text-xs font-medium tracking-[0.12em] text-[#FAF7F2] uppercase transition-colors hover:bg-[#3A3430] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C8396]"
            >
              {copy.navPrimaryCta}
            </a>
          </div>
        </div>
      </header>
    </div>
  );
}
