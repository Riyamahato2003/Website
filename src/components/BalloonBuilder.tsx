import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  MessageCircle,
  Package,
  AlertCircle,
  Truck,
  Store,
} from 'lucide-react';
import type {
  AtelierSettings,
  BalloonTint,
  BuilderConfig,
  EnquiryRecord,
  GiftStyleProduct,
  InsideCategory,
  InsideOption,
  Language,
  OccasionId,
  RibbonColor,
  VinylColor,
  VinylFont,
} from '../types';
import {
  CARD_MESSAGE_SUGGESTIONS,
  EXTRA_PRICES_DEMO,
  computeDemoTotalEur,
} from '../data/catalogDefaults';
import { UI_COPY } from '../data/translations';
import { BalloonPreview3D } from './BalloonPreview3D';

interface BalloonBuilderProps {
  language: Language;
  styles: GiftStyleProduct[];
  insideOptions: InsideOption[];
  settings: AtelierSettings;
  config: BuilderConfig;
  onChangeConfig: (updater: (prev: BuilderConfig) => BuilderConfig) => void;
  onResetDesign: () => void;
}

export function BalloonBuilder({
  language,
  styles,
  insideOptions,
  settings,
  config,
  onChangeConfig,
  onResetDesign,
}: BalloonBuilderProps) {
  const copy = UI_COPY[language];
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [insideCategoryFilter, setInsideCategoryFilter] = useState<InsideCategory>('plush');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<EnquiryRecord | null>(null);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const selectedStyle = useMemo(
    () => styles.find((s) => s.id === config.styleId) ?? styles[0],
    [styles, config.styleId]
  );

  const selectedPlush = useMemo(
    () =>
      config.selectedPlushId
        ? insideOptions.find((i) => i.id === config.selectedPlushId) ?? null
        : null,
    [insideOptions, config.selectedPlushId]
  );

  const selectedOutfit = useMemo(
    () =>
      config.selectedOutfitId
        ? insideOptions.find((i) => i.id === config.selectedOutfitId) ?? null
        : null,
    [insideOptions, config.selectedOutfitId]
  );

  const moneygiftOption = useMemo(
    () => insideOptions.find((i) => i.id === 'moneygift_rolls') ?? null,
    [insideOptions]
  );

  const productSubtotal = useMemo(
    () => computeDemoTotalEur(config, styles, insideOptions),
    [config, styles, insideOptions]
  );

  const shippingRate = useMemo(() => {
    if (config.fulfilment !== 'shipping') return null;
    return config.shippingCountry === 'BE'
      ? settings.shippingRateBE
      : settings.shippingRateNL;
  }, [config.fulfilment, config.shippingCountry, settings]);

  const estimatedTotalWithShipping = productSubtotal + (shippingRate ?? 0);

  const updateField = <K extends keyof BuilderConfig>(key: K, value: BuilderConfig[K]) => {
    onChangeConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectStyle = (style: GiftStyleProduct) => {
    if (!style.inStock) return;
    onChangeConfig((prev) => ({
      ...prev,
      styleId: style.id,
      ribbonColor: style.defaultRibbon,
      fulfilment: !style.shippable && prev.fulfilment === 'shipping' ? 'pickup' : prev.fulfilment,
    }));
  };

  const handleToggleInsideItem = (item: InsideOption) => {
    if (!item.inStock) return;
    if (item.category === 'plush') {
      onChangeConfig((prev) => ({
        ...prev,
        selectedPlushId: prev.selectedPlushId === item.id ? null : item.id,
      }));
      return;
    }
    if (item.category === 'outfit') {
      onChangeConfig((prev) => ({
        ...prev,
        selectedOutfitId: prev.selectedOutfitId === item.id ? null : item.id,
        outfitSize: item.sizes?.[0] ?? prev.outfitSize,
      }));
      return;
    }
    if (item.category === 'moneygift') {
      onChangeConfig((prev) => ({
        ...prev,
        includeMoneygift: !prev.includeMoneygift,
      }));
      return;
    }
    if (item.category === 'own_gift') {
      onChangeConfig((prev) => ({
        ...prev,
        includeOwnGift: !prev.includeOwnGift,
      }));
    }
  };

  const validateBeforeSubmit = (): string | null => {
    if (!config.customerName.trim() || !config.customerEmail.trim() || !config.customerPhone.trim()) {
      return language === 'nl'
        ? 'Vul bij stap 4 je naam, e-mailadres en telefoonnummer in.'
        : 'Please fill in your name, email address, and phone number in Step 4.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.customerEmail.trim())) {
      return language === 'nl'
        ? 'Controleer het e-mailadres bij stap 4.'
        : 'Please enter a valid email address in Step 4.';
    }
    if (config.fulfilment === 'shipping') {
      if (!selectedStyle.shippable) {
        return copy.shippingDisabledReason;
      }
      if (
        !config.shippingStreet.trim() ||
        !config.shippingPostalCode.trim() ||
        !config.shippingCity.trim()
      ) {
        return language === 'nl'
          ? 'Vul het volledige verzendadres in bij stap 4.'
          : 'Please complete the shipping address fields in Step 4.';
      }
    }
    return null;
  };

  const handleSubmitEnquiry = async () => {
    setSubmitError(null);
    const err = validateBeforeSubmit();
    if (err) {
      setSubmitError(err);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, language }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }
      setSubmittedEnquiry(data.enquiry as EnquiryRecord);
    } catch (e) {
      setSubmitError(
        e instanceof Error
          ? e.message
          : language === 'nl'
          ? 'Er ging iets mis bij het opslaan.'
          : 'Something went wrong while saving your enquiry.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const buildWhatsappSummaryText = (refCode?: string) => {
    const insideParts: string[] = [];
    if (selectedPlush) insideParts.push(selectedPlush.name[language]);
    if (selectedOutfit) insideParts.push(`${selectedOutfit.name[language]} (${config.outfitSize})`);
    if (config.includeMoneygift) insideParts.push(`Geldcadeau (${config.moneySlots} biljet-kokers)`);
    if (config.includeOwnGift) insideParts.push(`Eigen cadeau (${config.ownGiftDescription || 'in overleg'})`);

    const lines = [
      `Hallo Ballonnette! (${refCode ?? 'Aanvraag'})`,
      `Stijl: ${selectedStyle.name[language]}`,
      `Inhoud: ${insideParts.length > 0 ? insideParts.join(' + ') : 'Alleen basis'}`,
      `Tekst op ballon: "${config.balloonLine1 || '-'}" ${
        config.balloonLine2 ? `/ "${config.balloonLine2}"` : ''
      }`,
      `Ballon tint: ${config.balloonTint} · Vinyl: ${config.vinylColor} (${config.vinylFont}) · Lint: ${config.ribbonColor}`,
      `Levering: ${
        config.fulfilment === 'pickup'
          ? `Afhalen ${config.pickupCity} (${config.pickupTimeSlot})`
          : `Verzending ${config.shippingCountry}`
      }`,
      `Datum: ${config.eventDate || 'In overleg'}`,
      `Indicatieve demoprijs: €${estimatedTotalWithShipping.toFixed(2)}`,
    ];
    return lines.join('\n');
  };

  const handleCopyOrOpenWhatsapp = async () => {
    const text = buildWhatsappSummaryText(submittedEnquiry?.reference);
    if (settings.whatsappNumber) {
      const cleanPhone = settings.whatsappNumber.replace(/[^\d]/g, '');
      window.open(
        `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`,
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMsg(true);
      window.setTimeout(() => setCopiedMsg(false), 3000);
    } catch {
      setCopiedMsg(false);
    }
  };

  const visibleInsideItems = insideOptions.filter(
    (item) => item.category === insideCategoryFilter
  );

  const activePickupLocation =
    settings.pickupLocations.find((loc) => loc.city === config.pickupCity) ??
    settings.pickupLocations[0];

  const occasionLabels: Record<OccasionId, { nl: string; en: string }> = {
    newborn: { nl: 'Geboortecadeau', en: 'Newborn Gift' },
    baby_shower: { nl: 'Babyshower', en: 'Baby Shower' },
    gender_reveal: { nl: 'Gender Reveal', en: 'Gender Reveal' },
    birthday: { nl: 'Verjaardag', en: 'Birthday' },
    other: { nl: 'Overige gelegenheid', en: 'Other Occasion' },
  };

  const isInsideItemSelected = (item: InsideOption) => {
    if (item.category === 'plush') return config.selectedPlushId === item.id;
    if (item.category === 'outfit') return config.selectedOutfitId === item.id;
    if (item.category === 'moneygift') return config.includeMoneygift;
    if (item.category === 'own_gift') return config.includeOwnGift;
    return false;
  };

  return (
    <section id="studio" className="border-b border-[#E3DCD1] bg-[#FAF7F2] pt-12 pb-16 lg:pt-14 lg:pb-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        {/* Balanced Studio Entrance Header with Floating Visual Vignette on Right (Requirement 4) */}
        <div className="mb-8 grid grid-cols-1 items-center gap-8 border-b border-[#E3DCD1] pb-8 lg:grid-cols-12 lg:gap-10">
          {/* Left: Title + 4 Compact Atelier Pillars */}
          <div className="space-y-6 lg:col-span-7">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-[#6C8396] uppercase">
                {copy.studioEyebrow}
              </p>
              <h2 className="mt-2 font-serif-display text-balance text-3xl font-normal text-[#23201E] sm:text-4xl">
                {copy.studioTitle}
              </h2>
              <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-[#6B645E] sm:text-base">
                {copy.studioSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-[#E3DCD1] pt-5 sm:grid-cols-4">
              <div>
                <p className="text-[11px] tracking-[0.14em] text-[#6B645E] uppercase">
                  {copy.heroStat1Label}
                </p>
                <p className="mt-0.5 font-serif-display text-base font-medium text-[#23201E]">
                  {copy.heroStat1Value}
                </p>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.14em] text-[#6B645E] uppercase">
                  {copy.heroStat2Label}
                </p>
                <p className="mt-0.5 font-serif-display text-base font-medium text-[#23201E]">
                  {copy.heroStat2Value}
                </p>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.14em] text-[#6B645E] uppercase">
                  {copy.heroStat3Label}
                </p>
                <p className="mt-0.5 font-serif-display text-base font-medium text-[#23201E]">
                  {copy.heroStat3Value}
                </p>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.14em] text-[#6B645E] uppercase">
                  {copy.heroStat4Label}
                </p>
                <p className="mt-0.5 font-serif-display text-base font-medium text-[#23201E]">
                  {copy.heroStat4Value}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Floating 3D Balloons, Satin Ribbons & Gift Vignette */}
          <div className="relative flex min-h-[210px] items-center justify-center overflow-hidden rounded-sm border border-[#E3DCD1] bg-gradient-to-br from-[#EFEAE2] via-[#FAF7F2] to-[#E8DFD2] p-5 lg:col-span-5">
            {/* Ambient sunlit gradient glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 72% 28%, rgba(255,255,255,0.85) 0%, rgba(207,162,166,0.14) 45%, transparent 75%)',
              }}
            />

            {/* Floating Transparent & Pearl Balloons + Ribbons */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 flex items-center gap-4"
            >
              {/* Left Mini Gift Photograph Card */}
              <div className="relative -rotate-2 overflow-hidden rounded-sm border border-white/80 bg-white p-1.5 shadow-[0_18px_36px_-14px_rgba(35,32,30,0.22)]">
                <img
                  src="/src/assets/images/style_hatbox_bunny_1794825464514.jpg"
                  alt="Ballonnette Hat Box Arrangement"
                  referrerPolicy="no-referrer"
                  className="h-32 w-28 rounded-xs object-cover"
                />
              </div>

              {/* Center Floating Translucent Orb & Satin Bow */}
              <div className="relative -ml-6 flex flex-col items-center">
                <div
                  className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/85 shadow-[0_20px_40px_-14px_rgba(108,131,150,0.3)]"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 26%, rgba(255,255,255,0.85) 0%, rgba(232,198,201,0.25) 55%, rgba(108,131,150,0.24) 100%)',
                    backdropFilter: 'blur(3px)',
                  }}
                >
                  <div className="absolute top-3 left-4 h-9 w-5 -rotate-12 rounded-full bg-white/80 opacity-75" />
                  <span className="font-vinyl-script text-xl text-[#B99768]">Ballonnette</span>
                </div>
                <svg viewBox="0 0 80 48" className="-mt-1 h-11 w-16" aria-hidden="true">
                  <path
                    d="M40 2 C34 18, 46 30, 36 46"
                    fill="none"
                    stroke="#CFA2A6"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M40 2 C48 20, 34 32, 45 46"
                    fill="none"
                    stroke="#6C8396"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </svg>
              </div>

              {/* Right Mini Plush/Outfit Card */}
              <div className="relative -ml-5 mt-6 rotate-2 overflow-hidden rounded-sm border border-white/80 bg-white p-1.5 shadow-[0_18px_36px_-14px_rgba(35,32,30,0.22)]">
                <img
                  src="/src/assets/images/inside_cream_bunny_1794830278514.jpg"
                  alt="Cream Bunny Plush"
                  referrerPolicy="no-referrer"
                  className="h-28 w-24 rounded-xs object-cover"
                />
              </div>
            </motion.div>

            {/* Floating Secondary Pearl Balloon */}
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
              className="pointer-events-none absolute top-4 right-5 h-12 w-12 rounded-full border border-white/80 shadow-md"
              style={{
                background:
                  'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #E8C9CC 58%, #CFA2A6 100%)',
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Step Navigation Tabs (tight, seamless flow right into builder) */}
        <div
          className="mb-6 flex flex-wrap items-center gap-2 border-b border-[#E3DCD1] pb-4"
          role="tablist"
          aria-label="Builder steps"
        >
          {([1, 2, 3, 4, 5] as const).map((stepNum) => {
            const labelMap = {
              1: copy.step1Short,
              2: copy.step2Short,
              3: copy.step3Short,
              4: copy.step4Short,
              5: copy.step5Short,
            };
            const isActive = step === stepNum;
            return (
              <button
                key={stepNum}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setSubmittedEnquiry(null);
                  setStep(stepNum);
                }}
                className={`rounded-sm px-4 py-2 text-xs font-medium tracking-wide transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#23201E] text-[#FAF7F2]'
                    : 'border border-[#E3DCD1] bg-white text-[#6B645E] hover:border-[#23201E] hover:text-[#23201E]'
                }`}
              >
                {labelMap[stepNum]}
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Interactive Studio */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Sticky Live 3D Preview */}
          <div className="lg:sticky lg:top-28 lg:col-span-5">
            <BalloonPreview3D
              language={language}
              config={config}
              selectedStyle={selectedStyle}
              selectedPlush={selectedPlush}
              selectedOutfit={selectedOutfit}
              estimatedTotalEur={estimatedTotalWithShipping}
              onRemovePlush={() => updateField('selectedPlushId', null)}
              onRemoveOutfit={() => updateField('selectedOutfitId', null)}
              onRemoveMoneygift={() => updateField('includeMoneygift', false)}
              onRemoveOwnGift={() => updateField('includeOwnGift', false)}
            />
          </div>

          {/* Right Step Configuration Panel */}
          <div className="rounded-sm border border-[#E3DCD1] bg-white p-6 sm:p-8 lg:col-span-7">
            {submittedEnquiry ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3 border-b border-[#E3DCD1] pb-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6C8396]/15 text-[#6C8396]">
                    <Check className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-serif-display text-2xl text-[#23201E]">
                      {copy.confirmationTitle}
                    </h3>
                    <p className="mt-1 text-sm text-[#6B645E]">{copy.confirmationBody}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] p-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs tracking-[0.12em] text-[#6B645E] uppercase">
                      {copy.confirmationRefLabel}
                    </p>
                    <p className="mt-1 font-mono text-lg font-semibold text-[#23201E] tabular-nums">
                      {submittedEnquiry.reference}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.12em] text-[#6B645E] uppercase">
                      {copy.previewEstimatedTotal}
                    </p>
                    <p className="mt-1 font-serif-display text-2xl font-medium text-[#23201E] tabular-nums">
                      €{(submittedEnquiry.estimatedTotalEur ?? 0).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>

                <div className="rounded-sm border border-[#E3DCD1] bg-[#EFEAE2]/50 p-4 text-xs leading-relaxed text-[#6B645E]">
                  <p className="font-medium text-[#23201E]">
                    {language === 'nl'
                      ? 'Kopieeroverzicht voor WhatsApp / Instagram DM:'
                      : 'Summary text for WhatsApp / Instagram DM:'}
                  </p>
                  <pre className="mt-2 font-sans text-xs whitespace-pre-wrap text-[#23201E]">
                    {buildWhatsappSummaryText(submittedEnquiry.reference)}
                  </pre>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyOrOpenWhatsapp}
                    className="inline-flex items-center gap-2 rounded-sm bg-[#23201E] px-5 py-3 text-xs font-medium tracking-[0.12em] text-[#FAF7F2] uppercase transition-colors hover:bg-[#6C8396]"
                  >
                    {settings.whatsappNumber ? (
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>
                      {copiedMsg
                        ? language === 'nl'
                          ? 'Tekst gekopieerd!'
                          : 'Copied to clipboard!'
                        : copy.whatsappBtn}
                    </span>
                  </button>

                  <a
                    href="https://www.instagram.com/ballonnette/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-sm border border-[#E3DCD1] px-5 py-3 text-xs font-medium tracking-[0.12em] text-[#23201E] uppercase transition-colors hover:border-[#23201E]"
                  >
                    Instagram @ballonnette
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedEnquiry(null);
                      onResetDesign();
                      setStep(1);
                    }}
                    className="ml-auto text-xs font-medium text-[#6B645E] underline underline-offset-4 hover:text-[#23201E]"
                  >
                    {copy.newDesignBtn}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* STEP 1 — CHOOSE GIFT STYLE */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif-display text-2xl text-[#23201E]">
                        {copy.step1Heading}
                      </h3>
                      <p className="mt-1 text-xs text-[#6B645E]">{copy.step1Hint}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {styles.map((style) => {
                        const isSelected = config.styleId === style.id;
                        const blockedByShipping =
                          config.fulfilment === 'shipping' && !style.shippable;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            disabled={!style.inStock}
                            onClick={() => handleSelectStyle(style)}
                            className={`group flex flex-col overflow-hidden rounded-sm border text-left transition-all duration-200 ${
                              !style.inStock
                                ? 'cursor-not-allowed border-[#E3DCD1] opacity-55'
                                : isSelected
                                ? 'border-[#23201E] bg-[#FAF7F2] shadow-sm'
                                : 'border-[#E3DCD1] bg-white hover:-translate-y-0.5 hover:border-[#B99768]'
                            }`}
                          >
                            <div className="aspect-[4/3] w-full overflow-hidden bg-[#EFEAE2]">
                              <img
                                src={style.imageUrl}
                                alt={style.name[language]}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                            </div>
                            <div className="flex flex-1 flex-col justify-between p-4">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-serif-display text-lg font-medium text-[#23201E]">
                                    {style.name[language]}
                                  </h4>
                                  <span className="text-sm font-medium text-[#23201E] tabular-nums shrink-0">
                                    €{style.demoPriceEur}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-[#6B645E]">
                                  {style.description[language]}
                                </p>
                              </div>

                              <div className="mt-3 flex items-center justify-between border-t border-[#E3DCD1]/70 pt-2.5 text-[11px] text-[#6B645E]">
                                <span>
                                  {!style.inStock
                                    ? copy.outOfStockTag
                                    : style.shippable
                                    ? copy.shippableTag
                                    : copy.pickupOnlyTag}
                                </span>
                                {blockedByShipping && (
                                  <span className="text-[#9E524E]">
                                    {language === 'nl' ? 'Schakelt naar afhalen' : 'Switches to pickup'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2 — CHOOSE WHAT GOES INSIDE (Supports Plush + Outfit + Moneygift + Own Gift simultaneously) */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-serif-display text-2xl text-[#23201E]">
                        {copy.step2Heading}
                      </h3>
                      <p className="mt-1 text-xs text-[#6B645E]">{copy.step2MultiHint}</p>
                    </div>

                    {/* Category Filter Tabs */}
                    <div className="flex flex-wrap gap-1.5 rounded-sm bg-[#EFEAE2] p-1">
                      {(
                        [
                          { id: 'plush', label: copy.catPlush, active: Boolean(config.selectedPlushId) },
                          { id: 'outfit', label: copy.catOutfit, active: Boolean(config.selectedOutfitId) },
                          { id: 'moneygift', label: copy.catMoneygift, active: config.includeMoneygift },
                          { id: 'own_gift', label: copy.catOwnGift, active: config.includeOwnGift },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setInsideCategoryFilter(tab.id)}
                          className={`inline-flex items-center gap-1.5 rounded-sm px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                            insideCategoryFilter === tab.id
                              ? 'bg-white text-[#23201E] shadow-xs'
                              : 'text-[#6B645E] hover:text-[#23201E]'
                          }`}
                        >
                          <span>{tab.label}</span>
                          {tab.active && (
                            <Check className="h-3 w-3 text-[#6C8396]" aria-hidden="true" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Visual Cards Grid (2x2 balanced for Plush & Outfits!) */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {visibleInsideItems.map((item) => {
                        const isSelected = isInsideItemSelected(item);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            disabled={!item.inStock}
                            onClick={() => handleToggleInsideItem(item)}
                            className={`group relative flex flex-col overflow-hidden rounded-sm border text-left transition-all duration-200 ${
                              !item.inStock
                                ? 'cursor-not-allowed border-[#E3DCD1] opacity-55'
                                : isSelected
                                ? 'border-[#23201E] bg-[#FAF7F2] shadow-sm'
                                : 'border-[#E3DCD1] bg-white hover:-translate-y-0.5 hover:border-[#B99768]'
                            }`}
                          >
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFEAE2]">
                              <img
                                src={item.imageUrl}
                                alt={item.name[language]}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                              {isSelected && (
                                <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-sm bg-[#23201E]/90 px-2.5 py-1 text-[11px] font-medium text-[#FAF7F2]">
                                  <Check className="h-3 w-3" aria-hidden="true" />
                                  <span>{copy.selectedBadge}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-1 flex-col justify-between p-4">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-serif-display text-lg font-medium text-[#23201E]">
                                    {item.name[language]}
                                  </h4>
                                  <span className="text-sm font-medium text-[#23201E] tabular-nums shrink-0">
                                    {item.demoPriceEur > 0 ? `+€${item.demoPriceEur}` : '€0'}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-[#6B645E]">
                                  {item.description[language]}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Conditional Sub-Controls for Active Selections */}
                    {selectedOutfit && selectedOutfit.requiresSize && (
                      <div className="space-y-4 rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] p-4">
                        <div>
                          <label className="block text-xs font-medium tracking-wide text-[#23201E] uppercase">
                            {copy.selectSizeLabel} ({selectedOutfit.name[language]})
                          </label>
                          <div className="mt-2 flex gap-2">
                            {(selectedOutfit.sizes ?? ['50/56', '62/68']).map((sz) => (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => updateField('outfitSize', sz)}
                                className={`rounded-sm border px-4 py-2 text-xs font-medium tabular-nums transition-colors ${
                                  config.outfitSize === sz
                                    ? 'border-[#23201E] bg-[#23201E] text-[#FAF7F2]'
                                    : 'border-[#E3DCD1] bg-white text-[#23201E] hover:border-[#23201E]'
                                }`}
                              >
                                Maat {sz}
                              </button>
                            ))}
                          </div>
                        </div>

                        {selectedOutfit.supportsCustomName && (
                          <div>
                            <label
                              htmlFor="onesie-name-input"
                              className="block text-xs font-medium tracking-wide text-[#23201E] uppercase"
                            >
                              {copy.onesieNameLabel}
                            </label>
                            <input
                              id="onesie-name-input"
                              type="text"
                              value={config.onesieName}
                              onChange={(e) => updateField('onesieName', e.target.value)}
                              placeholder={copy.onesieNamePlaceholder}
                              className="mt-2 w-full rounded-sm border border-[#E3DCD1] bg-white px-3.5 py-2.5 text-sm text-[#23201E] focus:border-[#23201E] focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {(insideCategoryFilter === 'moneygift' || config.includeMoneygift) && (
                      <div className="space-y-4 rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] p-5">
                        <label className="flex cursor-pointer items-center justify-between text-sm">
                          <span className="flex items-center gap-2.5 font-medium text-[#23201E]">
                            <input
                              type="checkbox"
                              checked={config.includeMoneygift}
                              onChange={(e) => updateField('includeMoneygift', e.target.checked)}
                              className="h-4 w-4 accent-[#23201E]"
                            />
                            <span>{copy.moneyToggleLabel}</span>
                          </span>
                          <span className="text-xs font-medium text-[#6B645E] tabular-nums">
                            +€{(moneygiftOption?.demoPriceEur ?? 12) + (EXTRA_PRICES_DEMO.moneySlotsTier[config.moneySlots] ?? 0)}
                          </span>
                        </label>

                        {config.includeMoneygift && (
                          <>
                            <div>
                              <label className="block text-xs font-medium tracking-wide text-[#23201E] uppercase">
                                {copy.moneySlotsLabel}
                              </label>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {([5, 10, 20] as const).map((count) => {
                                  const extraFee = EXTRA_PRICES_DEMO.moneySlotsTier[count];
                                  return (
                                    <button
                                      key={count}
                                      type="button"
                                      onClick={() => updateField('moneySlots', count)}
                                      className={`rounded-sm border px-4 py-2 text-xs font-medium tabular-nums transition-colors ${
                                        config.moneySlots === count
                                          ? 'border-[#23201E] bg-[#23201E] text-[#FAF7F2]'
                                          : 'border-[#E3DCD1] bg-white text-[#23201E] hover:border-[#23201E]'
                                      }`}
                                    >
                                      {count} {copy.slotsUnit}
                                      {extraFee > 0 ? ` (+€${extraFee})` : ''}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="border-t border-[#E3DCD1] pt-3 text-xs leading-relaxed text-[#6B645E]">
                              <p className="font-medium text-[#23201E]">{copy.moneyNoticeTitle}</p>
                              <p className="mt-1">{copy.moneyNoticeBody}</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {(insideCategoryFilter === 'own_gift' || config.includeOwnGift) && (
                      <div className="space-y-3 rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] p-5">
                        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-[#23201E]">
                          <input
                            type="checkbox"
                            checked={config.includeOwnGift}
                            onChange={(e) => updateField('includeOwnGift', e.target.checked)}
                            className="h-4 w-4 accent-[#23201E]"
                          />
                          <span>{copy.ownGiftToggleLabel}</span>
                        </label>

                        {config.includeOwnGift && (
                          <>
                            <div className="flex items-start gap-2.5 border-t border-[#E3DCD1] pt-3">
                              <Package className="mt-0.5 h-4 w-4 shrink-0 text-[#6C8396]" aria-hidden="true" />
                              <div>
                                <p className="text-sm font-medium text-[#23201E]">
                                  {copy.ownGiftTitle}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-[#6B645E]">
                                  {copy.ownGiftBody}
                                </p>
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="own-gift-desc"
                                className="block text-xs font-medium text-[#23201E]"
                              >
                                {copy.ownGiftInputLabel}
                              </label>
                              <textarea
                                id="own-gift-desc"
                                rows={3}
                                value={config.ownGiftDescription}
                                onChange={(e) => updateField('ownGiftDescription', e.target.value)}
                                placeholder={copy.ownGiftPlaceholder}
                                className="mt-1.5 w-full rounded-sm border border-[#E3DCD1] bg-white px-3.5 py-2.5 text-sm text-[#23201E] focus:border-[#23201E] focus:outline-none"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3 — PERSONALISE YOUR BALLOON */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="font-serif-display text-2xl text-[#23201E]">
                      {copy.step3Heading}
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="balloon-line-1"
                          className="block text-xs font-medium tracking-wide text-[#23201E] uppercase"
                        >
                          {copy.balloonLine1Label}
                        </label>
                        <input
                          id="balloon-line-1"
                          type="text"
                          maxLength={24}
                          value={config.balloonLine1}
                          onChange={(e) => updateField('balloonLine1', e.target.value)}
                          placeholder={copy.balloonLine1Placeholder}
                          className="mt-1.5 w-full rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#23201E] focus:border-[#23201E] focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="balloon-line-2"
                          className="block text-xs font-medium tracking-wide text-[#23201E] uppercase"
                        >
                          {copy.balloonLine2Label}
                        </label>
                        <input
                          id="balloon-line-2"
                          type="text"
                          maxLength={30}
                          value={config.balloonLine2}
                          onChange={(e) => updateField('balloonLine2', e.target.value)}
                          placeholder={copy.balloonLine2Placeholder}
                          className="mt-1.5 w-full rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#23201E] focus:border-[#23201E] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Balloon Tint / Colour */}
                    <div>
                      <p className="text-xs font-medium tracking-wide text-[#23201E] uppercase">
                        {copy.balloonTintLabel}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2.5">
                        {(
                          [
                            { id: 'clear', label: language === 'nl' ? 'Kristalhelder' : 'Crystal Clear', swatch: '#FAF7F2' },
                            { id: 'blush', label: 'Soft Blush', swatch: '#E8C5C8' },
                            { id: 'dusty_blue', label: 'Dusty Blue', swatch: '#B3C6D6' },
                            { id: 'champagne', label: 'Champagne', swatch: '#E7D8BE' },
                          ] as { id: BalloonTint; label: string; swatch: string }[]
                        ).map((bt) => (
                          <button
                            key={bt.id}
                            type="button"
                            onClick={() => updateField('balloonTint', bt.id)}
                            className={`inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-xs font-medium transition-colors ${
                              config.balloonTint === bt.id
                                ? 'border-[#23201E] bg-[#FAF7F2] text-[#23201E]'
                                : 'border-[#E3DCD1] bg-white text-[#6B645E] hover:border-[#23201E]'
                            }`}
                          >
                            <span
                              className="h-3.5 w-3.5 rounded-full border border-[#23201E]/20"
                              style={{ backgroundColor: bt.swatch }}
                            />
                            <span>{bt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Vinyl Colour */}
                    <div>
                      <p className="text-xs font-medium tracking-wide text-[#23201E] uppercase">
                        {copy.vinylColorLabel}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2.5">
                        {(
                          [
                            { id: 'gold', label: 'Gold', swatch: '#B99768' },
                            { id: 'white', label: 'White', swatch: '#FFFFFF' },
                            { id: 'rose_gold', label: 'Rose Gold', swatch: '#C9928B' },
                          ] as { id: VinylColor; label: string; swatch: string }[]
                        ).map((vc) => (
                          <button
                            key={vc.id}
                            type="button"
                            onClick={() => updateField('vinylColor', vc.id)}
                            className={`inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-xs font-medium transition-colors ${
                              config.vinylColor === vc.id
                                ? 'border-[#23201E] bg-[#FAF7F2] text-[#23201E]'
                                : 'border-[#E3DCD1] bg-white text-[#6B645E] hover:border-[#23201E]'
                            }`}
                          >
                            <span
                              className="h-3.5 w-3.5 rounded-full border border-[#23201E]/20"
                              style={{ backgroundColor: vc.swatch }}
                            />
                            <span>{vc.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Typography Style */}
                    <div>
                      <p className="text-xs font-medium tracking-wide text-[#23201E] uppercase">
                        {copy.vinylFontLabel}
                      </p>
                      <div className="mt-2 grid grid-cols-3 gap-2.5">
                        {(
                          [
                            { id: 'script', label: 'Calligraphy', sampleClass: 'font-vinyl-script text-xl' },
                            { id: 'serif', label: 'Editorial Serif', sampleClass: 'font-serif-display italic text-base' },
                            { id: 'sans', label: 'Modern Sans', sampleClass: 'font-sans-body text-xs tracking-[0.12em] uppercase' },
                          ] as { id: VinylFont; label: string; sampleClass: string }[]
                        ).map((vf) => (
                          <button
                            key={vf.id}
                            type="button"
                            onClick={() => updateField('vinylFont', vf.id)}
                            className={`flex flex-col items-center justify-center rounded-sm border px-3 py-3 transition-colors ${
                              config.vinylFont === vf.id
                                ? 'border-[#23201E] bg-[#FAF7F2] text-[#23201E]'
                                : 'border-[#E3DCD1] bg-white text-[#6B645E] hover:border-[#23201E]'
                            }`}
                          >
                            <span className={vf.sampleClass}>Safiya</span>
                            <span className="mt-1 text-[11px]">{vf.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ribbon Colour */}
                    <div>
                      <p className="text-xs font-medium tracking-wide text-[#23201E] uppercase">
                        {copy.ribbonColorLabel}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2.5">
                        {(
                          [
                            { id: 'blush_pink', label: 'Blush Pink', swatch: '#CFA2A6' },
                            { id: 'dusty_blue', label: 'Dusty Blue', swatch: '#6C8396' },
                            { id: 'cream', label: language === 'nl' ? 'Crème' : 'Cream', swatch: '#E3D9C8' },
                            { id: 'sage', label: language === 'nl' ? 'Saliegroen' : 'Sage', swatch: '#7E8E7A' },
                          ] as { id: RibbonColor; label: string; swatch: string }[]
                        ).map((rc) => (
                          <button
                            key={rc.id}
                            type="button"
                            onClick={() => updateField('ribbonColor', rc.id)}
                            className={`inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-xs font-medium transition-colors ${
                              config.ribbonColor === rc.id
                                ? 'border-[#23201E] bg-[#FAF7F2] text-[#23201E]'
                                : 'border-[#E3DCD1] bg-white text-[#6B645E] hover:border-[#23201E]'
                            }`}
                          >
                            <span
                              className="h-3.5 w-3.5 rounded-full border border-[#23201E]/20"
                              style={{ backgroundColor: rc.swatch }}
                            />
                            <span>{rc.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Decorative Extras */}
                    <div>
                      <p className="text-xs font-medium tracking-wide text-[#23201E] uppercase">
                        {copy.extrasLabel}
                      </p>
                      <div className="mt-2 space-y-2">
                        <label className="flex cursor-pointer items-center justify-between rounded-sm border border-[#E3DCD1] bg-[#FAF7F2]/60 px-4 py-3 text-sm">
                          <span className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={config.addMiniBalloons}
                              onChange={(e) => updateField('addMiniBalloons', e.target.checked)}
                              className="h-4 w-4 accent-[#23201E]"
                            />
                            <span className="text-[#23201E]">{copy.extraMiniBalloons}</span>
                          </span>
                          <span className="text-xs font-medium text-[#6B645E] tabular-nums">
                            +€{EXTRA_PRICES_DEMO.miniBalloons}
                          </span>
                        </label>

                        <label className="flex cursor-pointer items-center justify-between rounded-sm border border-[#E3DCD1] bg-[#FAF7F2]/60 px-4 py-3 text-sm">
                          <span className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={config.addBabysBreath}
                              onChange={(e) => updateField('addBabysBreath', e.target.checked)}
                              className="h-4 w-4 accent-[#23201E]"
                            />
                            <span className="text-[#23201E]">{copy.extraBabysBreath}</span>
                          </span>
                          <span className="text-xs font-medium text-[#6B645E] tabular-nums">
                            +€{EXTRA_PRICES_DEMO.babysBreath}
                          </span>
                        </label>

                        {selectedStyle.hasBalloonDome && (
                          <label className="flex cursor-pointer items-center justify-between rounded-sm border border-[#E3DCD1] bg-[#FAF7F2]/60 px-4 py-3 text-sm">
                            <span className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={config.addBunnyDecal}
                                onChange={(e) => updateField('addBunnyDecal', e.target.checked)}
                                className="h-4 w-4 accent-[#23201E]"
                              />
                              <span className="text-[#23201E]">{copy.extraBunnyDecal}</span>
                            </span>
                            <span className="text-xs font-medium text-[#6B645E] tabular-nums">
                              +€{EXTRA_PRICES_DEMO.bunnyDecal}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4 — OCCASION & DELIVERY */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h3 className="font-serif-display text-2xl text-[#23201E]">
                      {copy.step4Heading}
                    </h3>

                    <div>
                      <p className="text-xs font-medium tracking-wide text-[#23201E] uppercase">
                        {copy.occasionLabel}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(Object.keys(occasionLabels) as OccasionId[]).map((occ) => (
                          <button
                            key={occ}
                            type="button"
                            onClick={() => updateField('occasion', occ)}
                            className={`rounded-sm border px-3.5 py-2 text-xs font-medium transition-colors ${
                              config.occasion === occ
                                ? 'border-[#23201E] bg-[#23201E] text-[#FAF7F2]'
                                : 'border-[#E3DCD1] bg-white text-[#6B645E] hover:border-[#23201E]'
                            }`}
                          >
                            {occasionLabels[occ][language]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <label
                        htmlFor="card-message"
                        className="block text-xs font-medium tracking-wide text-[#23201E] uppercase"
                      >
                        {copy.cardMessageLabel}
                      </label>
                      <textarea
                        id="card-message"
                        rows={3}
                        value={config.cardMessage}
                        onChange={(e) => updateField('cardMessage', e.target.value)}
                        placeholder={copy.cardMessagePlaceholder}
                        className="w-full rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#23201E] focus:border-[#23201E] focus:bg-white focus:outline-none"
                      />
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-medium text-[#6B645E]">
                          {copy.cardSuggestionsTitle}
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {CARD_MESSAGE_SUGGESTIONS[config.occasion][language].map((msg, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => updateField('cardMessage', msg)}
                              className="rounded-sm border border-[#E3DCD1] bg-[#FAF7F2]/60 px-3 py-2 text-left text-xs text-[#6B645E] transition-colors hover:border-[#B99768] hover:text-[#23201E]"
                            >
                              “{msg}”
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="event-date"
                        className="block text-xs font-medium tracking-wide text-[#23201E] uppercase"
                      >
                        {copy.eventDateLabel}
                      </label>
                      <input
                        id="event-date"
                        type="date"
                        value={config.eventDate}
                        onChange={(e) => updateField('eventDate', e.target.value)}
                        className="mt-1.5 w-full rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#23201E] focus:border-[#23201E] focus:bg-white focus:outline-none sm:max-w-xs"
                      />
                    </div>

                    <div className="space-y-3 border-t border-[#E3DCD1] pt-5">
                      <p className="text-xs font-medium tracking-wide text-[#23201E] uppercase">
                        {copy.fulfilmentLabel}
                      </p>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => updateField('fulfilment', 'pickup')}
                          className={`flex items-start gap-3 rounded-sm border p-4 text-left transition-colors ${
                            config.fulfilment === 'pickup'
                              ? 'border-[#23201E] bg-[#FAF7F2]'
                              : 'border-[#E3DCD1] bg-white hover:border-[#B99768]'
                          }`}
                        >
                          <Store className="mt-0.5 h-4 w-4 shrink-0 text-[#6C8396]" aria-hidden="true" />
                          <div>
                            <p className="text-sm font-medium text-[#23201E]">
                              {copy.pickupOptionTitle}
                            </p>
                            <p className="mt-0.5 text-xs text-[#6B645E]">
                              {copy.pickupOptionDesc}
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          disabled={!selectedStyle.shippable}
                          onClick={() => updateField('fulfilment', 'shipping')}
                          className={`flex items-start gap-3 rounded-sm border p-4 text-left transition-colors ${
                            !selectedStyle.shippable
                              ? 'cursor-not-allowed border-[#E3DCD1] bg-[#EFEAE2]/40 opacity-55'
                              : config.fulfilment === 'shipping'
                              ? 'border-[#23201E] bg-[#FAF7F2]'
                              : 'border-[#E3DCD1] bg-white hover:border-[#B99768]'
                          }`}
                        >
                          <Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#6C8396]" aria-hidden="true" />
                          <div>
                            <p className="text-sm font-medium text-[#23201E]">
                              {copy.shippingOptionTitle}
                            </p>
                            <p className="mt-0.5 text-xs text-[#6B645E]">
                              {copy.shippingOptionDesc}
                            </p>
                          </div>
                        </button>
                      </div>

                      {!selectedStyle.shippable && (
                        <p className="flex items-center gap-2 text-xs text-[#9E524E]">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span>{copy.shippingDisabledReason}</span>
                        </p>
                      )}

                      {config.fulfilment === 'pickup' ? (
                        <div className="grid grid-cols-1 gap-4 rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] p-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-medium text-[#23201E]">
                              {copy.pickupCityLabel}
                            </label>
                            <div className="mt-2 flex gap-2">
                              {settings.pickupLocations
                                .filter((loc) => loc.enabled)
                                .map((loc) => (
                                  <button
                                    key={loc.city}
                                    type="button"
                                    onClick={() => {
                                      updateField('pickupCity', loc.city);
                                      if (loc.timeSlots.length > 0) {
                                        updateField('pickupTimeSlot', loc.timeSlots[0]);
                                      }
                                    }}
                                    className={`rounded-sm border px-3.5 py-2 text-xs font-medium transition-colors ${
                                      config.pickupCity === loc.city
                                        ? 'border-[#23201E] bg-[#23201E] text-[#FAF7F2]'
                                        : 'border-[#E3DCD1] bg-white text-[#23201E]'
                                    }`}
                                  >
                                    {loc.city}
                                  </button>
                                ))}
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="pickup-time-select"
                              className="block text-xs font-medium text-[#23201E]"
                            >
                              {copy.pickupTimeLabel}
                            </label>
                            <select
                              id="pickup-time-select"
                              value={config.pickupTimeSlot}
                              onChange={(e) => updateField('pickupTimeSlot', e.target.value)}
                              className="mt-2 w-full rounded-sm border border-[#E3DCD1] bg-white px-3 py-2 text-xs text-[#23201E]"
                            >
                              {(activePickupLocation?.timeSlots ?? []).map((slot) => (
                                <option key={slot} value={slot}>
                                  {slot}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] p-4">
                          <div>
                            <p className="text-xs font-medium text-[#23201E]">
                              {copy.shippingCountryLabel}
                            </p>
                            <div className="mt-2 flex gap-2">
                              {(['NL', 'BE'] as const).map((country) => {
                                const rate =
                                  country === 'BE'
                                    ? settings.shippingRateBE
                                    : settings.shippingRateNL;
                                return (
                                  <button
                                    key={country}
                                    type="button"
                                    onClick={() => updateField('shippingCountry', country)}
                                    className={`rounded-sm border px-4 py-2 text-xs font-medium transition-colors ${
                                      config.shippingCountry === country
                                        ? 'border-[#23201E] bg-[#23201E] text-[#FAF7F2]'
                                        : 'border-[#E3DCD1] bg-white text-[#23201E]'
                                    }`}
                                  >
                                    {country === 'NL' ? 'Nederland' : 'België'}
                                    {rate !== null ? ` (€${rate.toFixed(2).replace('.', ',')})` : ''}
                                  </button>
                                );
                              })}
                            </div>
                            <p className="mt-2 text-xs text-[#6B645E]">
                              {shippingRate === null
                                ? copy.shippingRatePending
                                : settings.shippingNote[language]}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="sm:col-span-3">
                              <label className="block text-xs font-medium text-[#23201E]">
                                {copy.streetLabel}
                              </label>
                              <input
                                type="text"
                                value={config.shippingStreet}
                                onChange={(e) => updateField('shippingStreet', e.target.value)}
                                className="mt-1 w-full rounded-sm border border-[#E3DCD1] bg-white px-3 py-2 text-sm text-[#23201E]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-[#23201E]">
                                {copy.postalLabel}
                              </label>
                              <input
                                type="text"
                                value={config.shippingPostalCode}
                                onChange={(e) => updateField('shippingPostalCode', e.target.value)}
                                className="mt-1 w-full rounded-sm border border-[#E3DCD1] bg-white px-3 py-2 text-sm text-[#23201E]"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-medium text-[#23201E]">
                                {copy.cityLabel}
                              </label>
                              <input
                                type="text"
                                value={config.shippingCity}
                                onChange={(e) => updateField('shippingCity', e.target.value)}
                                className="mt-1 w-full rounded-sm border border-[#E3DCD1] bg-white px-3 py-2 text-sm text-[#23201E]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 border-t border-[#E3DCD1] pt-5">
                      <p className="text-xs font-medium tracking-wide text-[#23201E] uppercase">
                        {copy.customerDetailsLabel}
                      </p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium text-[#23201E]">
                            {copy.nameLabel}
                          </label>
                          <input
                            type="text"
                            value={config.customerName}
                            onChange={(e) => updateField('customerName', e.target.value)}
                            className="mt-1 w-full rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#23201E] focus:border-[#23201E] focus:bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#23201E]">
                            {copy.emailLabel}
                          </label>
                          <input
                            type="email"
                            value={config.customerEmail}
                            onChange={(e) => updateField('customerEmail', e.target.value)}
                            className="mt-1 w-full rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#23201E] focus:border-[#23201E] focus:bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#23201E]">
                            {copy.phoneLabel}
                          </label>
                          <input
                            type="tel"
                            value={config.customerPhone}
                            onChange={(e) => updateField('customerPhone', e.target.value)}
                            className="mt-1 w-full rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#23201E] focus:border-[#23201E] focus:bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#23201E]">
                            {copy.notesLabel}
                          </label>
                          <input
                            type="text"
                            value={config.customerNotes}
                            onChange={(e) => updateField('customerNotes', e.target.value)}
                            className="mt-1 w-full rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#23201E] focus:border-[#23201E] focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5 — REVIEW & ENQUIRE */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h3 className="font-serif-display text-2xl text-[#23201E]">
                      {copy.step5Heading}
                    </h3>

                    <div className="divide-y divide-[#E3DCD1] rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] px-5">
                      <div className="flex items-center justify-between py-3.5 text-sm">
                        <span className="text-[#6B645E]">{copy.step1Short}</span>
                        <span className="font-medium text-[#23201E] tabular-nums">
                          {selectedStyle.name[language]} (€{selectedStyle.demoPriceEur})
                        </span>
                      </div>

                      {selectedPlush && (
                        <div className="flex items-center justify-between py-3.5 text-sm">
                          <span className="text-[#6B645E]">{copy.catPlush}</span>
                          <span className="font-medium text-[#23201E] tabular-nums">
                            {selectedPlush.name[language]} (+€{selectedPlush.demoPriceEur})
                          </span>
                        </div>
                      )}

                      {selectedOutfit && (
                        <div className="flex items-center justify-between py-3.5 text-sm">
                          <span className="text-[#6B645E]">{copy.catOutfit}</span>
                          <span className="font-medium text-[#23201E] tabular-nums">
                            {selectedOutfit.name[language]} ({config.outfitSize}) (+€
                            {selectedOutfit.demoPriceEur})
                          </span>
                        </div>
                      )}

                      {config.includeMoneygift && (
                        <div className="flex items-center justify-between py-3.5 text-sm">
                          <span className="text-[#6B645E]">{copy.catMoneygift}</span>
                          <span className="font-medium text-[#23201E] tabular-nums">
                            {config.moneySlots} {copy.slotsUnit} (+€
                            {(moneygiftOption?.demoPriceEur ?? 12) +
                              (EXTRA_PRICES_DEMO.moneySlotsTier[config.moneySlots] ?? 0)}
                            )
                          </span>
                        </div>
                      )}

                      {config.includeOwnGift && (
                        <div className="flex items-center justify-between py-3.5 text-sm">
                          <span className="text-[#6B645E]">{copy.catOwnGift}</span>
                          <span className="max-w-xs truncate font-medium text-[#23201E]">
                            {config.ownGiftDescription || '€0'}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between py-3.5 text-sm">
                        <span className="text-[#6B645E]">{copy.step3Short}</span>
                        <span className="text-right font-medium text-[#23201E]">
                          “{config.balloonLine1 || '—'}” · {config.balloonTint} · {config.vinylColor} ·{' '}
                          {config.ribbonColor}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3.5 text-sm">
                        <span className="text-[#6B645E]">{copy.fulfilmentLabel}</span>
                        <span className="text-right font-medium text-[#23201E]">
                          {config.fulfilment === 'pickup'
                            ? `${copy.pickupOptionTitle}: ${config.pickupCity} (${config.pickupTimeSlot})`
                            : `${copy.shippingOptionTitle}: ${config.shippingCountry}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-4 text-base">
                        <span className="font-medium text-[#23201E]">
                          {copy.previewEstimatedTotal}
                        </span>
                        <span className="font-serif-display text-2xl font-medium text-[#23201E] tabular-nums">
                          €{estimatedTotalWithShipping.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-sm border border-[#E3DCD1] bg-[#EFEAE2]/60 p-4 text-xs leading-relaxed text-[#6B645E]">
                      <p className="font-medium text-[#23201E]">{copy.demoDisclaimerTitle}</p>
                      <p className="mt-1">{settings.demoPriceDisclaimer[language]}</p>
                    </div>

                    <div className="rounded-sm border border-[#E3DCD1] bg-white p-4 text-xs leading-relaxed text-[#6B645E]">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium text-[#23201E]">{copy.paymentPlannedTitle}</p>
                        <div className="flex items-center gap-3 text-[11px] font-medium text-[#6C8396]">
                          <span>iDEAL</span>
                          <span aria-hidden="true">·</span>
                          <span>Bancontact</span>
                          <span aria-hidden="true">·</span>
                          <span>Apple Pay</span>
                        </div>
                      </div>
                      <p className="mt-1.5">{copy.paymentPlannedBody}</p>
                    </div>

                    {submitError && (
                      <div className="flex items-center gap-2 rounded-sm border border-[#9E524E]/40 bg-[#9E524E]/10 px-4 py-3 text-xs text-[#7D3B38]">
                        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{submitError}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Step Controls */}
                <div className="mt-8 flex items-center justify-between border-t border-[#E3DCD1] pt-6">
                  <button
                    type="button"
                    disabled={step === 1}
                    onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4 | 5) : s))}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase transition-colors ${
                      step === 1
                        ? 'cursor-not-allowed text-[#E3DCD1]'
                        : 'text-[#6B645E] hover:text-[#23201E]'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    <span>{copy.prevStep}</span>
                  </button>

                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={() => setStep((s) => ((s + 1) as 1 | 2 | 3 | 4 | 5))}
                      className="inline-flex items-center gap-2 rounded-sm bg-[#23201E] px-6 py-3 text-xs font-medium tracking-[0.12em] text-[#FAF7F2] uppercase transition-colors hover:bg-[#6C8396]"
                    >
                      <span>{copy.nextStep}</span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCopyOrOpenWhatsapp}
                        className="inline-flex items-center gap-2 rounded-sm border border-[#E3DCD1] px-4 py-3 text-xs font-medium tracking-[0.1em] text-[#23201E] uppercase transition-colors hover:border-[#23201E]"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        <span>{copiedMsg ? 'Gekopieerd' : 'WhatsApp'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={submitting}
                        onClick={handleSubmitEnquiry}
                        className="inline-flex items-center gap-2 rounded-sm bg-[#23201E] px-6 py-3 text-xs font-medium tracking-[0.12em] text-[#FAF7F2] uppercase transition-colors hover:bg-[#6C8396] disabled:opacity-60"
                      >
                        <span>{submitting ? copy.submittingBtn : copy.submitEnquiryBtn}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
