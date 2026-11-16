import fs from 'fs';
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import {
  DEFAULT_GIFT_STYLES,
  DEFAULT_INSIDE_OPTIONS,
  DEFAULT_SETTINGS,
  computeDemoTotalEur,
} from './src/data/catalogDefaults.ts';
import type {
  AtelierSettings,
  BuilderConfig,
  EnquiryRecord,
  EnquiryStatus,
  GiftStyleProduct,
  InsideOption,
  Language,
} from './src/types.ts';

dotenv.config();

const PORT = 3000;
const ADMIN_PASSCODE = process.env.BALLONNETTE_ADMIN_PASSCODE || 'ballonnette';
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'ballonnette-db.json');
const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads');

interface DatabaseState {
  styles: GiftStyleProduct[];
  insideOptions: InsideOption[];
  settings: AtelierSettings;
  enquiries: EnquiryRecord[];
}

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function mergeMissingInsideOptions(existing: InsideOption[]): InsideOption[] {
  const existingIds = new Set(existing.map((item) => item.id));
  const merged = [...existing];
  for (const def of DEFAULT_INSIDE_OPTIONS) {
    if (!existingIds.has(def.id)) {
      // Insert in category order right after sibling items
      const lastSiblingIdx = merged.reduce(
        (acc, item, idx) => (item.category === def.category ? idx : acc),
        -1
      );
      if (lastSiblingIdx >= 0) {
        merged.splice(lastSiblingIdx + 1, 0, def);
      } else {
        merged.push(def);
      }
    }
  }
  return merged;
}

function loadDatabase(): DatabaseState {
  ensureDirectories();
  if (!fs.existsSync(DB_PATH)) {
    const initial: DatabaseState = {
      styles: DEFAULT_GIFT_STYLES,
      insideOptions: DEFAULT_INSIDE_OPTIONS,
      settings: DEFAULT_SETTINGS,
      enquiries: [],
    };
    saveDatabase(initial);
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<DatabaseState>;
    const existingInside =
      Array.isArray(parsed.insideOptions) && parsed.insideOptions.length > 0
        ? parsed.insideOptions
        : DEFAULT_INSIDE_OPTIONS;
    const mergedInside = mergeMissingInsideOptions(existingInside);

    const state: DatabaseState = {
      styles: Array.isArray(parsed.styles) && parsed.styles.length > 0 ? parsed.styles : DEFAULT_GIFT_STYLES,
      insideOptions: mergedInside,
      settings: parsed.settings ?? DEFAULT_SETTINGS,
      enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : [],
    };
    if (mergedInside.length !== existingInside.length) {
      saveDatabase(state);
    }
    return state;
  } catch {
    const fallback: DatabaseState = {
      styles: DEFAULT_GIFT_STYLES,
      insideOptions: DEFAULT_INSIDE_OPTIONS,
      settings: DEFAULT_SETTINGS,
      enquiries: [],
    };
    saveDatabase(fallback);
    return fallback;
  }
}

function saveDatabase(state: DatabaseState) {
  ensureDirectories();
  const tempPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(state, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_PATH);
}

function isAuthorizedAdmin(req: express.Request): boolean {
  const headerCode = req.header('x-admin-passcode');
  return typeof headerCode === 'string' && headerCode === ADMIN_PASSCODE;
}

function generateReference(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BAL-${year}-${rand}`;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '12mb' }));

  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/assets', express.static(path.resolve(process.cwd(), 'public', 'assets')));

  app.get('/api/catalog', (_req, res) => {
    const db = loadDatabase();
    res.json({
      styles: db.styles,
      insideOptions: db.insideOptions,
      settings: db.settings,
    });
  });

  app.post('/api/admin/verify', (req, res) => {
    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode : '';
    if (passcode === ADMIN_PASSCODE) {
      res.json({ ok: true });
      return;
    }
    res.status(401).json({ ok: false, error: 'Invalid atelier passcode' });
  });

  app.put('/api/catalog/styles/:id', (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const db = loadDatabase();
    const index = db.styles.findIndex((s) => s.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Gift style not found' });
      return;
    }

    const current = db.styles[index];
    const body = req.body ?? {};
    const updated: GiftStyleProduct = {
      ...current,
      name: body.name ? { nl: String(body.name.nl ?? current.name.nl), en: String(body.name.en ?? current.name.en) } : current.name,
      subtitle: body.subtitle
        ? { nl: String(body.subtitle.nl ?? current.subtitle.nl), en: String(body.subtitle.en ?? current.subtitle.en) }
        : current.subtitle,
      description: body.description
        ? { nl: String(body.description.nl ?? current.description.nl), en: String(body.description.en ?? current.description.en) }
        : current.description,
      demoPriceEur:
        typeof body.demoPriceEur === 'number' && Number.isFinite(body.demoPriceEur) && body.demoPriceEur >= 0
          ? Math.round(body.demoPriceEur * 100) / 100
          : current.demoPriceEur,
      shippable: typeof body.shippable === 'boolean' ? body.shippable : current.shippable,
      inStock: typeof body.inStock === 'boolean' ? body.inStock : current.inStock,
      imageUrl: typeof body.imageUrl === 'string' && body.imageUrl.trim() ? body.imageUrl.trim() : current.imageUrl,
    };

    db.styles[index] = updated;
    saveDatabase(db);
    res.json({ style: updated });
  });

  app.put('/api/catalog/inside/:id', (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const db = loadDatabase();
    const index = db.insideOptions.findIndex((o) => o.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Inside option not found' });
      return;
    }

    const current = db.insideOptions[index];
    const body = req.body ?? {};
    const updated: InsideOption = {
      ...current,
      name: body.name ? { nl: String(body.name.nl ?? current.name.nl), en: String(body.name.en ?? current.name.en) } : current.name,
      description: body.description
        ? { nl: String(body.description.nl ?? current.description.nl), en: String(body.description.en ?? current.description.en) }
        : current.description,
      demoPriceEur:
        typeof body.demoPriceEur === 'number' && Number.isFinite(body.demoPriceEur) && body.demoPriceEur >= 0
          ? Math.round(body.demoPriceEur * 100) / 100
          : current.demoPriceEur,
      inStock: typeof body.inStock === 'boolean' ? body.inStock : current.inStock,
      imageUrl: typeof body.imageUrl === 'string' && body.imageUrl.trim() ? body.imageUrl.trim() : current.imageUrl,
    };

    db.insideOptions[index] = updated;
    saveDatabase(db);
    res.json({ insideOption: updated });
  });

  app.put('/api/settings', (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const db = loadDatabase();
    const body = req.body ?? {};

    const parseNullableRate = (val: unknown, fallback: number | null): number | null => {
      if (val === null || val === '') return null;
      const num = Number(val);
      if (Number.isFinite(num) && num >= 0) return Math.round(num * 100) / 100;
      return fallback;
    };

    db.settings = {
      ...db.settings,
      shippingRateNL:
        'shippingRateNL' in body ? parseNullableRate(body.shippingRateNL, db.settings.shippingRateNL) : db.settings.shippingRateNL,
      shippingRateBE:
        'shippingRateBE' in body ? parseNullableRate(body.shippingRateBE, db.settings.shippingRateBE) : db.settings.shippingRateBE,
      shippingNote: body.shippingNote ?? db.settings.shippingNote,
      pickupLocations: Array.isArray(body.pickupLocations) ? body.pickupLocations : db.settings.pickupLocations,
      whatsappNumber: typeof body.whatsappNumber === 'string' ? body.whatsappNumber.trim() : db.settings.whatsappNumber,
      contactEmail: typeof body.contactEmail === 'string' ? body.contactEmail.trim() : db.settings.contactEmail,
    };

    saveDatabase(db);
    res.json({ settings: db.settings });
  });

  app.post('/api/upload', (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const dataUrl = typeof req.body?.dataUrl === 'string' ? req.body.dataUrl : '';
    const match = /^data:image\/(png|jpeg|jpg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
    if (!match) {
      res.status(400).json({ error: 'Invalid image format. Please upload PNG, JPG, or WebP.' });
      return;
    }

    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
    const buffer = Buffer.from(match[2], 'base64');
    if (buffer.length > 8 * 1024 * 1024) {
      res.status(400).json({ error: 'Image must be under 8 MB.' });
      return;
    }

    ensureDirectories();
    const filename = `product_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), buffer);
    res.json({ url: `/uploads/${filename}` });
  });

  app.post('/api/enquiries', (req, res) => {
    const db = loadDatabase();
    const body = req.body ?? {};
    const config = body.config as BuilderConfig | undefined;
    const language: Language = body.language === 'en' ? 'en' : 'nl';

    if (!config || !config.customerName?.trim() || !config.customerEmail?.trim() || !config.customerPhone?.trim()) {
      res.status(400).json({ error: 'Name, email, and phone are required.' });
      return;
    }

    const selectedStyle = db.styles.find((s) => s.id === config.styleId);
    if (!selectedStyle || !selectedStyle.inStock) {
      res.status(400).json({ error: 'Selected gift style is currently unavailable.' });
      return;
    }

    if (config.selectedPlushId) {
      const plush = db.insideOptions.find((i) => i.id === config.selectedPlushId);
      if (!plush || !plush.inStock) {
        res.status(400).json({ error: 'Selected plush companion is currently unavailable.' });
        return;
      }
    }

    if (config.selectedOutfitId) {
      const outfit = db.insideOptions.find((i) => i.id === config.selectedOutfitId);
      if (!outfit || !outfit.inStock) {
        res.status(400).json({ error: 'Selected baby outfit is currently unavailable.' });
        return;
      }
    }

    if (config.fulfilment === 'shipping' && !selectedStyle.shippable) {
      res.status(400).json({ error: 'Selected gift style is pickup only and cannot be shipped.' });
      return;
    }
    if (
      config.fulfilment === 'shipping' &&
      (!config.shippingStreet?.trim() || !config.shippingPostalCode?.trim() || !config.shippingCity?.trim())
    ) {
      res.status(400).json({ error: 'Shipping address is required for parcel delivery.' });
      return;
    }

    const productSubtotal = computeDemoTotalEur(config, db.styles, db.insideOptions);
    let shippingIncludedEur: number | null = null;
    if (config.fulfilment === 'shipping') {
      shippingIncludedEur =
        config.shippingCountry === 'BE' ? db.settings.shippingRateBE : db.settings.shippingRateNL;
    }

    const record: EnquiryRecord = {
      id: `enq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      reference: generateReference(),
      createdAt: new Date().toISOString(),
      status: 'new',
      language,
      config,
      estimatedTotalEur: productSubtotal + (shippingIncludedEur ?? 0),
      shippingIncludedEur,
    };

    db.enquiries.unshift(record);
    saveDatabase(db);
    res.status(201).json({ enquiry: record });
  });

  app.get('/api/enquiries', (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const db = loadDatabase();
    res.json({ enquiries: db.enquiries });
  });

  app.patch('/api/enquiries/:id', (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const db = loadDatabase();
    const index = db.enquiries.findIndex((e) => e.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }

    const status = req.body?.status as EnquiryStatus;
    if (!['new', 'reviewing', 'confirmed', 'completed'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    db.enquiries[index].status = status;
    saveDatabase(db);
    res.json({ enquiry: db.enquiries[index] });
  });

  app.delete('/api/enquiries/:id', (req, res) => {
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const db = loadDatabase();
    db.enquiries = db.enquiries.filter((e) => e.id !== req.params.id);
    saveDatabase(db);
    res.json({ ok: true });
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ballonnette server listening on http://localhost:${PORT}`);
  });
}

startServer();
