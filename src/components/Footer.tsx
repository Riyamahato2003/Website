import type { AtelierSettings, Language } from '../types';
import { UI_COPY } from '../data/translations';

interface FooterProps {
  language: Language;
  settings: AtelierSettings;
  onChangeLanguage: (lang: Language) => void;
  onReplayIntro: () => void;
  onOpenAdmin: () => void;
}

export function Footer({
  language,
  settings,
  onChangeLanguage,
  onReplayIntro,
  onOpenAdmin,
}: FooterProps) {
  const copy = UI_COPY[language];

  return (
    <footer id="atelier" className="bg-[#EFEAE2] py-14 text-[#23201E]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-[#E3DCD1] pb-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif-display text-3xl tracking-[0.14em] text-[#23201E]">
              BALLONNETTE
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#6B645E]">
              {copy.footerTagline}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[#6B645E]">
              {settings.demoPriceDisclaimer[language]}
            </p>
          </div>

          <div className="space-y-2 text-sm md:col-span-4">
            <p className="text-xs font-medium tracking-[0.16em] text-[#6B645E] uppercase">
              {language === 'nl' ? 'Afhalen & Verzending' : 'Pickup & Shipping'}
            </p>
            <p className="text-[#23201E]">Veenendaal · Utrecht</p>
            <p className="text-[#6B645E]">
              {language === 'nl'
                ? 'Verzending binnen Nederland & België (voor geschikte artikelen)'
                : 'Shipping within the Netherlands & Belgium (eligible items)'}
            </p>
            <a
              href="https://www.instagram.com/ballonnette/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block pt-1 text-xs font-medium text-[#6C8396] underline underline-offset-4 hover:text-[#23201E]"
            >
              {copy.footerInstagram}
            </a>
          </div>

          <div className="flex flex-col items-start gap-3 text-xs md:col-span-3 md:items-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChangeLanguage('nl')}
                className={language === 'nl' ? 'font-semibold underline' : 'text-[#6B645E]'}
              >
                Nederlands
              </button>
              <span className="text-[#6B645E]">·</span>
              <button
                type="button"
                onClick={() => onChangeLanguage('en')}
                className={language === 'en' ? 'font-semibold underline' : 'text-[#6B645E]'}
              >
                English
              </button>
            </div>

            <button
              type="button"
              onClick={onReplayIntro}
              className="text-[#6B645E] underline underline-offset-4 hover:text-[#23201E]"
            >
              {copy.footerReplayIntro}
            </button>

            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-[#6B645E] underline underline-offset-4 hover:text-[#23201E]"
            >
              {copy.adminBtn}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 text-xs text-[#6B645E]">
          <span>© {new Date().getFullYear()} Ballonnette</span>
          <span>@ballonnette</span>
        </div>
      </div>
    </footer>
  );
}
