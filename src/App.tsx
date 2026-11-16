import { useCallback, useEffect, useState } from 'react';
import type {
  AtelierSettings,
  BuilderConfig,
  GiftStyleProduct,
  InsideOption,
  Language,
} from './types';
import {
  DEFAULT_BUILDER_CONFIG,
  DEFAULT_GIFT_STYLES,
  DEFAULT_INSIDE_OPTIONS,
  DEFAULT_SETTINGS,
} from './data/catalogDefaults';
import { CinematicIntro } from './components/CinematicIntro';
import { TopNavigation } from './components/TopNavigation';
import { HeroSection } from './components/HeroSection';
import { EditorialStory } from './components/EditorialStory';
import { BalloonBuilder } from './components/BalloonBuilder';
import { GiftConcierge } from './components/GiftConcierge';
import { GalleryShowcase } from './components/GalleryShowcase';
import { FinalInvitation } from './components/FinalInvitation';
import { AdminStudioModal } from './components/AdminStudioModal';
import { Footer } from './components/Footer';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved =
      typeof window !== 'undefined' ? window.localStorage.getItem('ballonnette_lang') : null;
    return saved === 'en' ? 'en' : 'nl';
  });

  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);

  const [styles, setStyles] = useState<GiftStyleProduct[]>(DEFAULT_GIFT_STYLES);
  const [insideOptions, setInsideOptions] = useState<InsideOption[]>(DEFAULT_INSIDE_OPTIONS);
  const [settings, setSettings] = useState<AtelierSettings>(DEFAULT_SETTINGS);
  const [config, setConfig] = useState<BuilderConfig>(DEFAULT_BUILDER_CONFIG);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    document.documentElement.lang = lang;
    window.localStorage.setItem('ballonnette_lang', lang);
  };

  const fetchCatalog = useCallback(async () => {
    try {
      const res = await fetch('/api/catalog');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.styles) && data.styles.length > 0) {
        setStyles(data.styles);
      }
      if (Array.isArray(data.insideOptions) && data.insideOptions.length > 0) {
        setInsideOptions(data.insideOptions);
      }
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch {
      // Fall back silently to defaults if offline
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    fetchCatalog();
  }, [fetchCatalog, language]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const applyPresetToBuilder = (patch: Partial<BuilderConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...patch,
    }));
    scrollToSection('studio');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#23201E]">
      <CinematicIntro
        language={language}
        visible={showIntro}
        onComplete={() => setShowIntro(false)}
      />

      <TopNavigation
        language={language}
        onChangeLanguage={handleLanguageChange}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      <main>
        <HeroSection
          language={language}
          onStartBuilder={() => scrollToSection('studio')}
          onJumpConcierge={() => scrollToSection('concierge')}
          onQuickPreset={applyPresetToBuilder}
        />

        <EditorialStory
          language={language}
          onSelectCollection={applyPresetToBuilder}
        />

        <BalloonBuilder
          language={language}
          styles={styles}
          insideOptions={insideOptions}
          settings={settings}
          config={config}
          onChangeConfig={setConfig}
          onResetDesign={() => setConfig(DEFAULT_BUILDER_CONFIG)}
        />

        <GiftConcierge
          language={language}
          styles={styles}
          insideOptions={insideOptions}
          onApplyRecommendation={applyPresetToBuilder}
        />

        <GalleryShowcase
          language={language}
          onSelectPreset={applyPresetToBuilder}
        />

        <FinalInvitation
          language={language}
          onStartBuilder={() => scrollToSection('studio')}
        />
      </main>

      <Footer
        language={language}
        settings={settings}
        onChangeLanguage={handleLanguageChange}
        onReplayIntro={() => setShowIntro(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      <AdminStudioModal
        language={language}
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        styles={styles}
        insideOptions={insideOptions}
        settings={settings}
        onRefreshCatalog={fetchCatalog}
      />
    </div>
  );
}
