export type Language = 'nl' | 'en';

export type GiftStyleId =
  | 'hatbox_bunny'
  | 'wicker_carriage'
  | 'moneygift_balloon'
  | 'outfit_balloon'
  | 'gender_reveal';

export type InsideCategory = 'plush' | 'outfit' | 'moneygift' | 'own_gift';

export type InsideOptionId =
  | 'beige_bunny'
  | 'pink_bunny'
  | 'cream_teddy'
  | 'cream_bunny'
  | 'beige_romper'
  | 'lace_dress'
  | 'name_onesie'
  | 'knit_cardigan_set'
  | 'moneygift_rolls'
  | 'own_gift';

export type BalloonTint = 'clear' | 'blush' | 'dusty_blue' | 'champagne';
export type VinylColor = 'gold' | 'white' | 'rose_gold';
export type VinylFont = 'script' | 'serif' | 'sans';
export type RibbonColor = 'blush_pink' | 'dusty_blue' | 'cream' | 'sage';
export type OccasionId = 'baby_shower' | 'newborn' | 'gender_reveal' | 'birthday' | 'other';
export type FulfilmentMethod = 'pickup' | 'shipping';
export type PickupCity = 'Veenendaal' | 'Utrecht';
export type ShippingCountry = 'NL' | 'BE';

export interface LocalizedText {
  nl: string;
  en: string;
}

export interface GiftStyleProduct {
  id: GiftStyleId;
  name: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  demoPriceEur: number;
  imageUrl: string;
  shippable: boolean;
  inStock: boolean;
  hasBalloonDome: boolean;
  recommendedInside: InsideOptionId[];
  defaultRibbon: RibbonColor;
}

export interface InsideOption {
  id: InsideOptionId;
  category: InsideCategory;
  name: LocalizedText;
  description: LocalizedText;
  demoPriceEur: number;
  imageUrl: string;
  inStock: boolean;
  requiresSize?: boolean;
  sizes?: string[];
  supportsCustomName?: boolean;
  supportsBanknoteSlots?: boolean;
}

export interface AtelierSettings {
  shippingRateNL: number | null;
  shippingRateBE: number | null;
  shippingNote: LocalizedText;
  pickupLocations: {
    city: PickupCity;
    enabled: boolean;
    timeSlots: string[];
  }[];
  whatsappNumber: string;
  contactEmail: string;
  instagramHandle: string;
  demoPriceDisclaimer: LocalizedText;
}

export interface BuilderConfig {
  styleId: GiftStyleId;
  selectedPlushId: InsideOptionId | null;
  selectedOutfitId: InsideOptionId | null;
  includeMoneygift: boolean;
  includeOwnGift: boolean;
  outfitSize: string;
  onesieName: string;
  moneySlots: 5 | 10 | 20;
  ownGiftDescription: string;
  balloonLine1: string;
  balloonLine2: string;
  balloonTint: BalloonTint;
  vinylColor: VinylColor;
  vinylFont: VinylFont;
  ribbonColor: RibbonColor;
  addMiniBalloons: boolean;
  addBabysBreath: boolean;
  addBunnyDecal: boolean;
  occasion: OccasionId;
  cardMessage: string;
  eventDate: string;
  fulfilment: FulfilmentMethod;
  pickupCity: PickupCity;
  pickupTimeSlot: string;
  shippingCountry: ShippingCountry;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingStreet: string;
  shippingPostalCode: string;
  shippingCity: string;
  customerNotes: string;
}

export type EnquiryStatus = 'new' | 'reviewing' | 'confirmed' | 'completed';

export interface EnquiryRecord {
  id: string;
  reference: string;
  createdAt: string;
  status: EnquiryStatus;
  language: Language;
  config: BuilderConfig;
  estimatedTotalEur: number | null;
  shippingIncludedEur: number | null;
}

export interface GalleryMediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  title: LocalizedText;
  caption: LocalizedText;
  presetStyleId: GiftStyleId;
  presetPlushId: InsideOptionId | null;
  presetOutfitId: InsideOptionId | null;
  presetMoneygift?: boolean;
  presetRibbon: RibbonColor;
  presetTint?: BalloonTint;
  presetText: string;
}
