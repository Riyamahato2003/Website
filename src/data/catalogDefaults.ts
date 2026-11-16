import type {
  AtelierSettings,
  BuilderConfig,
  GalleryMediaItem,
  GiftStyleProduct,
  InsideOption,
  OccasionId,
} from '../types';

export const DEFAULT_GIFT_STYLES: GiftStyleProduct[] = [
  {
    id: 'hatbox_bunny',
    name: {
      nl: 'Hat Box met Pluchen Konijn',
      en: 'Hat Box with Plush Bunny',
    },
    subtitle: {
      nl: 'Kristalheldere ballon op geschulpte hoedendoos',
      en: 'Crystal-clear orb on scalloped floral hat box',
    },
    description: {
      nl: 'Onze signatuur-presentatie: een zacht bedje van wolkjes in een transparante ballon bovenop een luxe geschulpte bewaardoos.',
      en: 'Our signature presentation: fluffy clouds inside a transparent orb perched atop a luxury scalloped keepsake hat box.',
    },
    demoPriceEur: 54,
    imageUrl: '/src/assets/images/style_hatbox_bunny_1794825464514.jpg',
    shippable: true,
    inStock: true,
    hasBalloonDome: true,
    recommendedInside: ['pink_bunny', 'beige_bunny', 'cream_teddy', 'cream_bunny'],
    defaultRibbon: 'blush_pink',
  },
  {
    id: 'wicker_carriage',
    name: {
      nl: 'Rieten Kinderwagen Mand',
      en: 'Wicker Baby Carriage Basket',
    },
    subtitle: {
      nl: 'Handgevlochten rotan op houten wieltjes',
      en: 'Handwoven wicker carriage on solid wood wheels',
    },
    description: {
      nl: 'Een betoverende rieten kinderwagen met hortensia- of gipskruidaccenten, satijnen strik en gepersonaliseerd hartlabel.',
      en: 'An heirloom wicker pram styled with delicate hydrangeas or baby’s breath, satin ribbon, and a personalised keepsake tag.',
    },
    demoPriceEur: 68,
    imageUrl: '/src/assets/images/style_wicker_carriage_1794825464666.jpg',
    shippable: false,
    inStock: true,
    hasBalloonDome: false,
    recommendedInside: ['beige_romper', 'cream_teddy', 'lace_dress', 'knit_cardigan_set'],
    defaultRibbon: 'dusty_blue',
  },
  {
    id: 'moneygift_balloon',
    name: {
      nl: 'Geldcadeau Ballon',
      en: 'Moneygift Balloon',
    },
    subtitle: {
      nl: 'Zwevende ballon boven gevulde rieten mand',
      en: 'Floating personalised orb above woven gift basket',
    },
    description: {
      nl: 'Combineer opgerolde bankbiljetten met een knuffeltje en gipskruid onder een gepersonaliseerde transparante ballon.',
      en: 'Pairs neatly rolled banknote scrolls with a plush companion and baby’s breath beneath a custom lettered transparent orb.',
    },
    demoPriceEur: 58,
    imageUrl: '/src/assets/images/style_moneygift_balloon_1794825465901.jpg',
    shippable: true,
    inStock: true,
    hasBalloonDome: true,
    recommendedInside: ['moneygift_rolls', 'cream_teddy', 'beige_bunny'],
    defaultRibbon: 'dusty_blue',
  },
  {
    id: 'outfit_balloon',
    name: {
      nl: 'Babykleding Display Ballon',
      en: 'Baby Outfit Display Balloon',
    },
    subtitle: {
      nl: 'Kleding setje gepresenteerd in wafeldoek-mand',
      en: 'Baby outfit displayed inside orb on waffle-knit basket',
    },
    description: {
      nl: 'Een compleet babysette wordt zwevend en kreukvrij uitgestald in een grote transparante ballon op een zachte omslagdoek.',
      en: 'A curated baby outfit suspended cleanly inside a crystal-clear balloon resting on a soft waffle-knit blanket basket.',
    },
    demoPriceEur: 56,
    imageUrl: '/src/assets/images/style_outfit_balloon_1794825464531.jpg',
    shippable: true,
    inStock: true,
    hasBalloonDome: true,
    recommendedInside: ['beige_romper', 'lace_dress', 'name_onesie', 'knit_cardigan_set'],
    defaultRibbon: 'cream',
  },
  {
    id: 'gender_reveal',
    name: {
      nl: 'Reuze "It\'s a..." Gender Reveal Ballon',
      en: 'Giant "It\'s a..." Gender Reveal Balloon',
    },
    subtitle: {
      nl: 'Matte parelmoer-ivoren ballon met zijden linten',
      en: 'Matte pearl ivory balloon with trailing silk ribbons',
    },
    description: {
      nl: 'Extra grote ondoorzichtige parelballon gevuld met roze of blauwe confetti naar keuze, afgewerkt met lange linten in dusty blue en blush.',
      en: 'Statement matte pearl ivory reveal balloon filled with hidden pink or blue confetti and finished with trailing dusty blue and blush ribbons.',
    },
    demoPriceEur: 62,
    imageUrl: '/src/assets/images/style_gender_reveal_1794825466297.jpg',
    shippable: false,
    inStock: true,
    hasBalloonDome: true,
    recommendedInside: ['own_gift', 'beige_bunny', 'cream_teddy'],
    defaultRibbon: 'sage',
  },
];

export const DEFAULT_INSIDE_OPTIONS: InsideOption[] = [
  {
    id: 'beige_bunny',
    category: 'plush',
    name: { nl: 'Beige Konijn Knuffel', en: 'Beige Bunny Plush' },
    description: {
      nl: 'Boterzachte hangoor-konijn in warm zandbeige met ivoren satijnen strikje.',
      en: 'Velvet-soft floppy-eared bunny in warm sand beige with ivory satin bow.',
    },
    demoPriceEur: 18,
    imageUrl: '/src/assets/images/inside_beige_bunny_1794825466098.jpg',
    inStock: true,
  },
  {
    id: 'pink_bunny',
    category: 'plush',
    name: { nl: 'Dusty Pink Konijn Knuffel', en: 'Dusty Pink Bunny Plush' },
    description: {
      nl: 'Dromerig oudroze pluchen konijntje met verfijnde bloemvoering in de oortjes.',
      en: 'Dreamy dusty blush pink plush bunny with delicate floral inner ears.',
    },
    demoPriceEur: 18,
    imageUrl: '/src/assets/images/inside_pink_bunny_1794825466527.jpg',
    inStock: true,
  },
  {
    id: 'cream_teddy',
    category: 'plush',
    name: { nl: 'Klassieke Crème Teddybeer', en: 'Classic Cream Teddy Bear' },
    description: {
      nl: 'Tijdloze crèmekleurige teddybeer met champagne-satijnen strik.',
      en: 'Timeless warm cream teddy bear finished with a champagne satin bow.',
    },
    demoPriceEur: 20,
    imageUrl: '/src/assets/images/inside_cream_teddy_1794825466184.jpg',
    inStock: true,
  },
  {
    id: 'cream_bunny',
    category: 'plush',
    name: { nl: 'Zacht Crème Konijn met Satijnen Strik', en: 'Soft Cream Bunny with Satin Bow' },
    description: {
      nl: 'Fluweelzacht warm-ivoren konijntje met lange oortjes en een champagne-satijnen strik.',
      en: 'Velvet-soft warm ivory bunny with floppy ears finished with a champagne satin bow.',
    },
    demoPriceEur: 18,
    imageUrl: '/src/assets/images/inside_cream_bunny_1794830278514.jpg',
    inStock: true,
  },
  {
    id: 'beige_romper',
    category: 'outfit',
    name: { nl: 'Neutrale Beige Romper & Sokjes Set', en: 'Neutral Beige Romper & Socks Set' },
    description: {
      nl: 'Grofgebreide biologisch katoenen romper met houten knoopjes en bijpassende slofjes.',
      en: 'Organic cotton cable-knit baby romper with wooden buttons and matching booties.',
    },
    demoPriceEur: 25,
    imageUrl: '/src/assets/images/inside_beige_romper_1794825466937.jpg',
    inStock: true,
    requiresSize: true,
    sizes: ['50/56', '62/68'],
  },
  {
    id: 'lace_dress',
    category: 'outfit',
    name: { nl: 'Witte Kanten Doop- / Feestjurk', en: 'White Lace Christening / Special Dress' },
    description: {
      nl: 'Heirloom wit katoenen kanten jurkje met geborduurd kraagje en satijnen tailleband.',
      en: 'Heirloom white cotton lace dress with embroidered collar and satin sash.',
    },
    demoPriceEur: 35,
    imageUrl: '/src/assets/images/inside_lace_dress_1794825467592.jpg',
    inStock: true,
    requiresSize: true,
    sizes: ['50/56', '62/68'],
  },
  {
    id: 'name_onesie',
    category: 'outfit',
    name: { nl: 'Gepersonaliseerd Naam-Rompertje', en: 'Personalised Name Onesie' },
    description: {
      nl: 'Zacht ivoren katoenen rompertje voorzien van geborduurde of gedrukte babynaam.',
      en: 'Soft ivory organic cotton onesie personalised with the baby’s name.',
    },
    demoPriceEur: 22,
    imageUrl: '/src/assets/images/inside_name_onesie_1794825467483.jpg',
    inStock: true,
    requiresSize: true,
    sizes: ['50/56', '62/68'],
    supportsCustomName: true,
  },
  {
    id: 'knit_cardigan_set',
    category: 'outfit',
    name: {
      nl: 'Neutraal Gebreid Vestje, Mutsje & Slofjes Set',
      en: 'Neutral Knit Baby Cardigan, Bonnet & Booties Set',
    },
    description: {
      nl: 'Driedelige zandkleurige breiset met houten knoopjes, strikmutsje en zachte gebreide slofjes.',
      en: 'Three-piece sand knit set featuring a wooden-button cardigan, tie bonnet, and matching knit booties.',
    },
    demoPriceEur: 28,
    imageUrl: '/src/assets/images/inside_knit_cardigan_set_1794830279812.jpg',
    inStock: true,
    requiresSize: true,
    sizes: ['50/56', '62/68'],
  },
  {
    id: 'moneygift_rolls',
    category: 'moneygift',
    name: { nl: 'Geldcadeau Opgerolde Biljet-Houders', en: 'Moneygift Rolled Banknote Slots' },
    description: {
      nl: 'Kies 5, 10 of 20 met lint gestrikte houders. Bankbiljetten lever je zelf aan of stem je apart af.',
      en: 'Choose 5, 10, or 20 ribbon-tied slots. Banknotes are provided by you separately and never included in this price.',
    },
    demoPriceEur: 12,
    imageUrl: '/src/assets/images/inside_moneygift_rolls_1794825467929.jpg',
    inStock: true,
    supportsBanknoteSlots: true,
  },
  {
    id: 'own_gift',
    category: 'own_gift',
    name: { nl: 'Eigen cadeau aanleveren', en: 'Provide my own gift' },
    description: {
      nl: 'Wij verpakken jouw eigen knuffel, kleertje of sieraad vakkundig in een Ballonnette creatie.',
      en: 'We artfully style and encapsulate your own keepsake, plush, or outfit inside a Ballonnette creation.',
    },
    demoPriceEur: 0,
    imageUrl: '/src/assets/images/inside_moneygift_rolls_1794825467929.jpg',
    inStock: true,
  },
];

export const DEFAULT_SETTINGS: AtelierSettings = {
  shippingRateNL: null,
  shippingRateBE: null,
  shippingNote: {
    nl: 'Verzendtarieven voor Nederland en België zijn bewerkbaar via Atelier Beheer en worden definitief bevestigd na je aanvraag.',
    en: 'Shipping rates for the Netherlands and Belgium are editable in Owner Admin and confirmed upon enquiry.',
  },
  pickupLocations: [
    {
      city: 'Veenendaal',
      enabled: true,
      timeSlots: ['10:00 – 12:00', '13:00 – 16:00', '16:30 – 18:30'],
    },
    {
      city: 'Utrecht',
      enabled: true,
      timeSlots: ['11:00 – 13:00', '14:00 – 17:00'],
    },
  ],
  whatsappNumber: '',
  contactEmail: '',
  instagramHandle: '@ballonnette',
  demoPriceDisclaimer: {
    nl: 'Alle getoonde eurobedragen zijn indicatieve demoprijzen ter illustratie en vormen geen geverifieerde Ballonnette-tarieven.',
    en: 'All EUR prices shown are illustrative demo placeholders, not verified Ballonnette pricing.',
  },
};

export const DEFAULT_BUILDER_CONFIG: BuilderConfig = {
  styleId: 'hatbox_bunny',
  selectedPlushId: 'pink_bunny',
  selectedOutfitId: null,
  includeMoneygift: false,
  includeOwnGift: false,
  outfitSize: '50/56',
  onesieName: 'Safiya',
  moneySlots: 10,
  ownGiftDescription: '',
  balloonLine1: 'Safiya',
  balloonLine2: 'Welkom lief kleintje',
  balloonTint: 'clear',
  vinylColor: 'gold',
  vinylFont: 'script',
  ribbonColor: 'blush_pink',
  addMiniBalloons: true,
  addBabysBreath: false,
  addBunnyDecal: true,
  occasion: 'newborn',
  cardMessage: '',
  eventDate: '',
  fulfilment: 'pickup',
  pickupCity: 'Veenendaal',
  pickupTimeSlot: '13:00 – 16:00',
  shippingCountry: 'NL',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  shippingStreet: '',
  shippingPostalCode: '',
  shippingCity: '',
  customerNotes: '',
};

export const EXTRA_PRICES_DEMO = {
  miniBalloons: 12,
  babysBreath: 8,
  bunnyDecal: 5,
  moneySlotsTier: {
    5: 0,
    10: 4,
    20: 9,
  } as Record<5 | 10 | 20, number>,
};

export const CARD_MESSAGE_SUGGESTIONS: Record<
  OccasionId,
  { nl: string[]; en: string[] }
> = {
  newborn: {
    nl: [
      'Welkom op de wereld, klein wondertje. Dat elke dag gevuld mag zijn met liefde en zachtheid.',
      'Zo klein, zo teder, zo oneindig geliefd. Van harte gefeliciteerd met jullie prachtige kindje.',
      'Moge dit nieuwe hoofdstuk stralen van geluk, gezondheid en eindeloze knuffels.',
    ],
    en: [
      'Welcome to the world, little miracle. May every day be filled with warmth and wonder.',
      'So tiny, so precious, already so deeply loved. Heartfelt congratulations on your new arrival.',
      'Wishing your growing family endless cuddles, gentle mornings, and joyful memories.',
    ],
  },
  baby_shower: {
    nl: [
      'Wat kijken wij enorm uit naar de komst van jullie kleintje. Geniet van deze bijzondere babyshower!',
      'Een klein cadeautje voor een heel groot geluk dat bijna arriveert.',
      'Liefs voor mama en het kleine wonder dat onderweg is.',
    ],
    en: [
      'Counting down the days until we meet your sweet little one. Enjoy this beautiful celebration!',
      'A thoughtful keepsake for the biggest blessing soon to arrive.',
      'Sending warmth and love to the mama-to-be and little bundle on the way.',
    ],
  },
  gender_reveal: {
    nl: [
      'Roze wolkjes of hemelsblauw — jullie kindje is nu al het allermooiste cadeau!',
      'Wat een magisch moment! Proost op een stralende toekomst samen.',
    ],
    en: [
      'Blush clouds or dusty blue skies — your little one is already the greatest gift of all.',
      'What a magical reveal! Wishing you joy for every milestone ahead.',
    ],
  },
  birthday: {
    nl: [
      'Van harte gefeliciteerd! Een feestelijke ballon en een klein zakcentje voor jouw mooiste wens.',
      'Op een prachtig nieuw levensjaar vol zachte momenten en gouden herinneringen.',
    ],
    en: [
      'Happy birthday! A celebratory keepsake balloon paired with wishes for your brightest year yet.',
      'Here is to a wonderful new chapter filled with warmth and celebration.',
    ],
  },
  other: {
    nl: [
      'Speciaal voor jou samengesteld, voor een onvergetelijk moment.',
      'Met veel liefde gekozen en met zorg ingepakt.',
    ],
    en: [
      'Thoughtfully composed just for you, to celebrate a cherished milestone.',
      'Chosen with love and wrapped with quiet elegance.',
    ],
  },
};

export const THREE_ATELIER_REELS: GalleryMediaItem[] = [
  {
    id: 'vid_hatbox_reveal',
    type: 'video',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-16_at_17.24.39_054441ac.mp4',
    title: { nl: 'Atelier Reel · Hat Box & Bunny', en: 'Atelier Reel · Hat Box & Bunny' },
    caption: {
      nl: 'Kristalheldere ballon met oudroze konijn op geschulpte bloemen-hoedendoos en mini-ballonnen.',
      en: 'Crystal orb with dusty pink bunny perched on a scalloped floral hat box & mini balloons.',
    },
    presetStyleId: 'hatbox_bunny',
    presetPlushId: 'pink_bunny',
    presetOutfitId: null,
    presetRibbon: 'blush_pink',
    presetTint: 'clear',
    presetText: 'Safiya',
  },
  {
    id: 'vid_teddy_chiffon',
    type: 'video',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-16_at_17.24.25_82f7c7ef.mp4',
    title: { nl: 'Atelier Reel · Teddybeer & Chiffon', en: 'Atelier Reel · Teddy & Chiffon' },
    caption: {
      nl: 'Warme teddybeer met minibeer op een bedje van witte veertjes, afgewerkt met een chiffon strik.',
      en: 'Warm plush teddy holding a baby bear on white feathers, finished with a flowing chiffon bow.',
    },
    presetStyleId: 'hatbox_bunny',
    presetPlushId: 'cream_teddy',
    presetOutfitId: null,
    presetRibbon: 'cream',
    presetTint: 'champagne',
    presetText: 'Welkom kleintje',
  },
  {
    id: 'vid_soulayman_knit',
    type: 'video',
    src: '/assets/aistudio/WhatsApp_Video_2026-11-16_at_17.23.12_d326fe07.mp4',
    title: { nl: 'Atelier Reel · Soulayman Breiset', en: 'Atelier Reel · Soulayman Knit Set' },
    caption: {
      nl: 'Zacht babyvestje en slofjes zwevend in een transparante ballon met sierlijke kalligrafie op gebreide deken.',
      en: 'Plush baby cardigan & booties inside a crystal orb with script lettering over a knitted blanket.',
    },
    presetStyleId: 'outfit_balloon',
    presetPlushId: null,
    presetOutfitId: 'knit_cardigan_set',
    presetRibbon: 'cream',
    presetTint: 'clear',
    presetText: 'Soulayman',
  },
];

export const AUTHENTIC_GALLERY_ITEMS: GalleryMediaItem[] = [
  ...THREE_ATELIER_REELS,
  {
    id: 'gal_hatbox_pink',
    type: 'image',
    src: '/assets/aistudio/image_4cf04c83.png',
    title: { nl: 'Blush Konijn in Hoedendoos', en: 'Blush Bunny Hat Box' },
    caption: {
      nl: 'Kristalheldere ballon met oudroze konijn op bloemen-hoedendoos en mini-ballonnen.',
      en: 'Crystal orb with dusty pink bunny on a scalloped floral hat box & mini balloons.',
    },
    presetStyleId: 'hatbox_bunny',
    presetPlushId: 'pink_bunny',
    presetOutfitId: null,
    presetRibbon: 'blush_pink',
    presetTint: 'clear',
    presetText: 'Safiya',
  },
  {
    id: 'gal_money_rayan',
    type: 'image',
    src: '/assets/aistudio/image_a9f32b2a.png',
    title: { nl: 'Geldcadeau Ballon “Rayan”', en: 'Moneygift Balloon “Rayan”' },
    caption: {
      nl: 'Gouden kalligrafie, dusty blue satijnen strikken, teddyberen, gipskruid en opgerolde biljetten.',
      en: 'Gold calligraphy, dusty blue satin bows, teddy bears, baby’s breath & rolled banknotes.',
    },
    presetStyleId: 'moneygift_balloon',
    presetPlushId: 'cream_teddy',
    presetOutfitId: null,
    presetMoneygift: true,
    presetRibbon: 'dusty_blue',
    presetTint: 'clear',
    presetText: 'Rayan',
  },
  {
    id: 'gal_carriage_louay',
    type: 'image',
    src: '/assets/aistudio/image_0609d101.png',
    title: { nl: 'Rieten Kinderwagen “Louay”', en: 'Wicker Carriage “Louay”' },
    caption: {
      nl: 'Handgevlochten kinderwagen op houten wieltjes met dusty blue hortensia’s en hartlabel.',
      en: 'Woven wicker carriage on wooden wheels with dusty blue hydrangeas & heart tag.',
    },
    presetStyleId: 'wicker_carriage',
    presetPlushId: 'cream_teddy',
    presetOutfitId: null,
    presetRibbon: 'dusty_blue',
    presetTint: 'clear',
    presetText: 'Louay',
  },
  {
    id: 'gal_romper_noussair',
    type: 'image',
    src: '/assets/aistudio/image_33529fda.png',
    title: { nl: 'Babykleding Ballon “Noussair”', en: 'Baby Outfit Balloon “Noussair”' },
    caption: {
      nl: 'Gebreide neutrale romper met slofjes in transparante ballon op een gebreide dekenmand.',
      en: 'Knit neutral romper & booties suspended in a clear orb on a knitted blanket basket.',
    },
    presetStyleId: 'outfit_balloon',
    presetPlushId: null,
    presetOutfitId: 'beige_romper',
    presetRibbon: 'cream',
    presetTint: 'clear',
    presetText: 'Noussair',
  },
  {
    id: 'gal_decal_safiya',
    type: 'image',
    src: '/assets/aistudio/image_4c97640e.png',
    title: { nl: 'Detail: Gouden Konijn & Vlinder', en: 'Detail: Gold Bunny & Butterfly' },
    caption: {
      nl: 'Blush ballon met fijn gouden konijnen-silhouet, vlinderaccent en persoonlijke kaart.',
      en: 'Blush balloon featuring delicate gold bunny artwork, butterfly & scalloped card.',
    },
    presetStyleId: 'hatbox_bunny',
    presetPlushId: 'cream_bunny',
    presetOutfitId: null,
    presetRibbon: 'blush_pink',
    presetTint: 'blush',
    presetText: 'Safiya',
  },
  {
    id: 'gal_hotair_youssef',
    type: 'image',
    src: '/assets/aistudio/image_257424b0.png',
    title: { nl: 'Luchtballon Mand “Youssef”', en: 'Hot-Air Basket “Youssef”' },
    caption: {
      nl: 'Dusty blue & witte ballonnenwolk met gipskruid en teddybeer in een gevlochten mand.',
      en: 'Dusty blue & ivory balloon canopy with gypsophila and plush bear in woven basket.',
    },
    presetStyleId: 'moneygift_balloon',
    presetPlushId: 'cream_teddy',
    presetOutfitId: null,
    presetRibbon: 'dusty_blue',
    presetTint: 'dusty_blue',
    presetText: 'Youssef',
  },
];

export function computeDemoTotalEur(
  config: BuilderConfig,
  styles: GiftStyleProduct[],
  insideOptions: InsideOption[]
): number {
  const style = styles.find((s) => s.id === config.styleId);
  const plush = config.selectedPlushId
    ? insideOptions.find((i) => i.id === config.selectedPlushId)
    : undefined;
  const outfit = config.selectedOutfitId
    ? insideOptions.find((i) => i.id === config.selectedOutfitId)
    : undefined;
  const moneyOption = insideOptions.find((i) => i.id === 'moneygift_rolls');

  let total = style?.demoPriceEur ?? 0;
  if (plush) total += plush.demoPriceEur;
  if (outfit) total += outfit.demoPriceEur;
  if (config.includeMoneygift) {
    total += (moneyOption?.demoPriceEur ?? 12) + (EXTRA_PRICES_DEMO.moneySlotsTier[config.moneySlots] ?? 0);
  }
  if (config.addMiniBalloons) total += EXTRA_PRICES_DEMO.miniBalloons;
  if (config.addBabysBreath) total += EXTRA_PRICES_DEMO.babysBreath;
  if (config.addBunnyDecal && (style?.hasBalloonDome ?? true)) {
    total += EXTRA_PRICES_DEMO.bunnyDecal;
  }

  return total;
}

export interface ConciergeAnswers {
  occasion: 'newborn' | 'baby_shower' | 'gender_reveal' | 'birthday';
  budget: 'under_75' | '75_to_95' | '95_plus';
  palette: 'dusty_blue' | 'blush_pink' | 'champagne_cream' | 'sage_ivory';
}

export interface ConciergeRecommendation {
  title: { nl: string; en: string };
  rationale: { nl: string; en: string };
  imageUrl: string;
  secondaryImageUrl: string;
  patch: Partial<BuilderConfig>;
}

export function runRulesConcierge(answers: ConciergeAnswers): ConciergeRecommendation[] {
  const ribbonMap = {
    dusty_blue: 'dusty_blue' as const,
    blush_pink: 'blush_pink' as const,
    champagne_cream: 'cream' as const,
    sage_ivory: 'sage' as const,
  };
  const tintMap = {
    dusty_blue: 'dusty_blue' as const,
    blush_pink: 'blush' as const,
    champagne_cream: 'champagne' as const,
    sage_ivory: 'clear' as const,
  };
  const ribbon = ribbonMap[answers.palette];
  const tint = tintMap[answers.palette];

  if (answers.occasion === 'gender_reveal') {
    return [
      {
        title: {
          nl: 'Reuze "It\'s a..." Gender Reveal Arrangement',
          en: 'Giant "It\'s a..." Gender Reveal Arrangement',
        },
        rationale: {
          nl: 'Speciaal ontworpen voor het onthullingsmoment met parelmoer afwerking, zijden linten en zachte knuffel.',
          en: 'Crafted for the big reveal moment with matte pearl finish, trailing silk ribbons, and a soft keepsake bunny.',
        },
        imageUrl: '/src/assets/images/style_gender_reveal_1794825466297.jpg',
        secondaryImageUrl: '/src/assets/images/inside_cream_bunny_1794830278514.jpg',
        patch: {
          styleId: 'gender_reveal',
          selectedPlushId: answers.budget === 'under_75' ? null : 'cream_bunny',
          selectedOutfitId: null,
          includeMoneygift: false,
          includeOwnGift: answers.budget === 'under_75',
          balloonLine1: 'Boy or Girl?',
          balloonLine2: 'Liefde in aantocht',
          balloonTint: 'champagne',
          ribbonColor: ribbon,
          vinylColor: 'gold',
          occasion: 'gender_reveal',
          addMiniBalloons: answers.budget !== 'under_75',
        },
      },
      {
        title: {
          nl: 'Hoedendoos met Crème Konijn & Satijnen Strik',
          en: 'Hat Box with Cream Bunny & Satin Bow',
        },
        rationale: {
          nl: 'Een neutrale blijvende herinnering voor de babykamer (ook zorgvuldig verzendbaar in NL & BE).',
          en: 'A gender-neutral nursery keepsake arrangement (also eligible for parcel shipping in NL & BE).',
        },
        imageUrl: '/src/assets/images/style_hatbox_bunny_1794825464514.jpg',
        secondaryImageUrl: '/src/assets/images/inside_cream_bunny_1794830278514.jpg',
        patch: {
          styleId: 'hatbox_bunny',
          selectedPlushId: 'cream_bunny',
          selectedOutfitId: answers.budget === '95_plus' ? 'knit_cardigan_set' : null,
          includeMoneygift: false,
          balloonLine1: 'Baby on the way',
          balloonLine2: '',
          balloonTint: tint,
          ribbonColor: ribbon,
          vinylColor: 'gold',
          occasion: 'gender_reveal',
          addMiniBalloons: answers.budget === '95_plus',
        },
      },
    ];
  }

  if (answers.occasion === 'birthday') {
    return [
      {
        title: {
          nl: 'Luxe Geldcadeau Ballon in Rieten Mand',
          en: 'Luxury Moneygift Balloon Basket',
        },
        rationale: {
          nl: 'Combineert feestelijke personalisatie met keurig opgerolde biljet-kokers, gipskruid en een zachte teddy.',
          en: 'Pairs celebratory custom lettering with ribbon-tied banknote slots, baby’s breath, and a classic plush.',
        },
        imageUrl: '/src/assets/images/style_moneygift_balloon_1794825465901.jpg',
        secondaryImageUrl: '/src/assets/images/inside_moneygift_rolls_1794825467929.jpg',
        patch: {
          styleId: 'moneygift_balloon',
          selectedPlushId: answers.budget === 'under_75' ? null : 'cream_teddy',
          selectedOutfitId: null,
          includeMoneygift: true,
          moneySlots: answers.budget === '95_plus' ? 20 : 10,
          balloonLine1: 'Gefeliciteerd!',
          balloonLine2: 'Een klein cadeautje voor jou',
          balloonTint: tint,
          ribbonColor: ribbon,
          vinylColor: 'gold',
          occasion: 'birthday',
          addBabysBreath: true,
        },
      },
      {
        title: {
          nl: 'Hoedendoos Ballon met Klassieke Teddybeer',
          en: 'Hat Box Balloon with Classic Teddy Bear',
        },
        rationale: {
          nl: 'Stijlvol alternatief met mini-ballonnen en gouden vinyltekst op maat.',
          en: 'A sculptural tabletop alternative with mini balloons and bespoke gold vinyl lettering.',
        },
        imageUrl: '/src/assets/images/style_hatbox_bunny_1794825464514.jpg',
        secondaryImageUrl: '/src/assets/images/inside_cream_teddy_1794825466184.jpg',
        patch: {
          styleId: 'hatbox_bunny',
          selectedPlushId: 'cream_teddy',
          selectedOutfitId: null,
          includeMoneygift: answers.budget === '95_plus',
          balloonLine1: 'Happy Birthday',
          balloonLine2: '',
          balloonTint: tint,
          ribbonColor: ribbon,
          vinylColor: answers.palette === 'blush_pink' ? 'rose_gold' : 'gold',
          occasion: 'birthday',
          addMiniBalloons: answers.budget !== 'under_75',
        },
      },
    ];
  }

  // Newborn or Baby Shower
  const outfitChoice =
    answers.budget === '95_plus'
      ? 'lace_dress'
      : answers.budget === '75_to_95'
      ? 'knit_cardigan_set'
      : null;

  const plushChoice =
    answers.palette === 'blush_pink'
      ? 'pink_bunny'
      : answers.palette === 'champagne_cream'
      ? 'cream_bunny'
      : 'beige_bunny';

  return [
    {
      title: {
        nl:
          answers.budget === '95_plus'
            ? 'Rieten Kinderwagen met Kanten Jurk & Konijn'
            : 'Babykleding Display Ballon met Gebreide Set',
        en:
          answers.budget === '95_plus'
            ? 'Wicker Carriage with Lace Dress & Bunny'
            : 'Baby Outfit Display Balloon with Knit Set',
      },
      rationale: {
        nl: 'Ideaal kraam- of babyshowercadeau dat direct een pronkstuk vormt in de babykamer.',
        en: 'An unforgettable newborn or baby shower centrepiece designed to double as nursery decor.',
      },
      imageUrl:
        answers.budget === '95_plus'
          ? '/src/assets/images/style_wicker_carriage_1794825464666.jpg'
          : '/src/assets/images/style_outfit_balloon_1794825464531.jpg',
      secondaryImageUrl:
        answers.budget === '95_plus'
          ? '/src/assets/images/inside_lace_dress_1794825467592.jpg'
          : '/src/assets/images/inside_knit_cardigan_set_1794830279812.jpg',
      patch: {
        styleId: answers.budget === '95_plus' ? 'wicker_carriage' : 'outfit_balloon',
        selectedPlushId: answers.budget === '95_plus' ? plushChoice : null,
        selectedOutfitId: outfitChoice ?? 'beige_romper',
        includeMoneygift: false,
        balloonTint: tint,
        ribbonColor: ribbon,
        vinylColor: answers.palette === 'blush_pink' ? 'rose_gold' : 'gold',
        occasion: answers.occasion,
        addBabysBreath: answers.budget !== 'under_75',
        addMiniBalloons: answers.budget === '95_plus',
      },
    },
    {
      title: {
        nl: 'Hoedendoos Ballon met Zacht Pluchen Konijn',
        en: 'Hat Box Balloon with Velvet-Soft Plush Bunny',
      },
      rationale: {
        nl: 'Onze bestseller in de gekozen tinten — ook zorgvuldig te verzenden binnen NL en BE.',
        en: 'Our signature keepsake hat box styled in your chosen palette — also eligible for NL/BE shipping.',
      },
      imageUrl: '/src/assets/images/style_hatbox_bunny_1794825464514.jpg',
      secondaryImageUrl:
        answers.palette === 'blush_pink'
          ? '/src/assets/images/inside_pink_bunny_1794825466527.jpg'
          : '/src/assets/images/inside_cream_bunny_1794830278514.jpg',
      patch: {
        styleId: 'hatbox_bunny',
        selectedPlushId: plushChoice,
        selectedOutfitId: answers.budget === '95_plus' ? 'name_onesie' : null,
        includeMoneygift: false,
        balloonTint: tint,
        ribbonColor: ribbon,
        vinylColor: 'gold',
        occasion: answers.occasion,
        addMiniBalloons: answers.budget !== 'under_75',
        addBunnyDecal: true,
      },
    },
  ];
}
