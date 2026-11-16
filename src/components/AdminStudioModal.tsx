import { useEffect, useState } from 'react';
import { Lock, Trash2, Upload, X } from 'lucide-react';
import type {
  AtelierSettings,
  EnquiryRecord,
  EnquiryStatus,
  GiftStyleProduct,
  InsideOption,
  Language,
} from '../types';

interface AdminStudioModalProps {
  language: Language;
  open: boolean;
  onClose: () => void;
  styles: GiftStyleProduct[];
  insideOptions: InsideOption[];
  settings: AtelierSettings;
  onRefreshCatalog: () => Promise<void>;
}

export function AdminStudioModal({
  language,
  open,
  onClose,
  styles,
  insideOptions,
  settings,
  onRefreshCatalog,
}: AdminStudioModalProps) {
  const [passcode, setPasscode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'enquiries' | 'catalog' | 'settings'>('enquiries');

  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const [localSettings, setLocalSettings] = useState<AtelierSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const fetchEnquiries = async (code: string) => {
    setLoadingEnquiries(true);
    try {
      const res = await fetch('/api/enquiries', {
        headers: { 'x-admin-passcode': code },
      });
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries ?? []);
      }
    } finally {
      setLoadingEnquiries(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });
    if (res.ok) {
      setAuthenticated(true);
      await fetchEnquiries(passcode);
    } else {
      setAuthError(
        language === 'nl' ? 'Ongeldige ateliercode.' : 'Invalid atelier passcode.'
      );
    }
  };

  const flashNotice = (msg: string) => {
    setSaveNotice(msg);
    window.setTimeout(() => setSaveNotice(null), 2600);
  };

  const handleUpdateEnquiryStatus = async (id: string, status: EnquiryStatus) => {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-passcode': passcode,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await fetchEnquiries(passcode);
      flashNotice(language === 'nl' ? 'Status bijgewerkt' : 'Status updated');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-passcode': passcode },
    });
    if (res.ok) {
      await fetchEnquiries(passcode);
    }
  };

  const handleUploadImage = async (
    file: File,
    onDone: (uploadedUrl: string) => Promise<void>
  ) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== 'string') return;
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode,
        },
        body: JSON.stringify({ dataUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          await onDone(data.url);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateStyle = async (
    id: string,
    patch: Partial<GiftStyleProduct>
  ) => {
    const res = await fetch(`/api/catalog/styles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-passcode': passcode,
      },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      await onRefreshCatalog();
      flashNotice(language === 'nl' ? 'Product opgeslagen' : 'Product saved');
    }
  };

  const handleUpdateInside = async (id: string, patch: Partial<InsideOption>) => {
    const res = await fetch(`/api/catalog/inside/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-passcode': passcode,
      },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      await onRefreshCatalog();
      flashNotice(language === 'nl' ? 'Optie opgeslagen' : 'Option saved');
    }
  };

  const handleSaveSettings = async () => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-passcode': passcode,
      },
      body: JSON.stringify(localSettings),
    });
    if (res.ok) {
      await onRefreshCatalog();
      flashNotice(language === 'nl' ? 'Instellingen opgeslagen' : 'Settings saved');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#23201E]/65 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] shadow-2xl">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E3DCD1] bg-white px-6 py-4">
          <div>
            <p className="text-[11px] tracking-[0.16em] text-[#6C8396] uppercase">
              Ballonnette Atelier
            </p>
            <h2 className="font-serif-display text-2xl text-[#23201E]">
              {language === 'nl' ? 'Beheer & Catalogus Studio' : 'Owner Admin & Catalogue Studio'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {saveNotice && (
              <span className="text-xs font-medium text-[#6C8396]">{saveNotice}</span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Admin"
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-[#E3DCD1] text-[#23201E] hover:bg-[#EFEAE2]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {!authenticated ? (
          <form onSubmit={handleLogin} className="mx-auto my-12 w-full max-w-sm space-y-4 px-6">
            <div className="flex items-center gap-2 text-[#23201E]">
              <Lock className="h-4 w-4 text-[#6C8396]" aria-hidden="true" />
              <p className="text-sm font-medium">
                {language === 'nl' ? 'Atelier toegangscode' : 'Atelier Passcode'}
              </p>
            </div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="ballonnette"
              className="w-full rounded-sm border border-[#E3DCD1] bg-white px-3.5 py-2.5 text-sm text-[#23201E] focus:border-[#23201E] focus:outline-none"
            />
            <p className="text-xs text-[#6B645E]">
              {language === 'nl'
                ? 'Demo toegangscode: ballonnette'
                : 'Demo studio passcode: ballonnette'}
            </p>
            {authError && <p className="text-xs text-[#9E524E]">{authError}</p>}
            <button
              type="submit"
              className="w-full rounded-sm bg-[#23201E] px-4 py-2.5 text-xs font-medium tracking-[0.12em] text-[#FAF7F2] uppercase hover:bg-[#6C8396]"
            >
              {language === 'nl' ? 'Open Atelier Beheer' : 'Unlock Owner Studio'}
            </button>
          </form>
        ) : (
          <>
            {/* Admin Navigation Tabs */}
            <div className="flex gap-1 border-b border-[#E3DCD1] bg-[#EFEAE2]/60 px-6 py-2">
              {(
                [
                  {
                    id: 'enquiries',
                    nl: `Aanvragen (${enquiries.length})`,
                    en: `Enquiries (${enquiries.length})`,
                  },
                  { id: 'catalog', nl: 'Catalogus, Foto’s & Prijzen', en: 'Catalogue, Photos & Prices' },
                  { id: 'settings', nl: 'Verzending & Contact', en: 'Shipping & Contact' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`rounded-sm px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === t.id
                      ? 'bg-white text-[#23201E] shadow-xs'
                      : 'text-[#6B645E] hover:text-[#23201E]'
                  }`}
                >
                  {t[language]}
                </button>
              ))}
            </div>

            {/* Admin Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TAB 1: ENQUIRIES */}
              {activeTab === 'enquiries' && (
                <div className="space-y-4">
                  {loadingEnquiries ? (
                    <p className="text-sm text-[#6B645E]">Loading...</p>
                  ) : enquiries.length === 0 ? (
                    <div className="rounded-sm border border-[#E3DCD1] bg-white p-8 text-center text-sm text-[#6B645E]">
                      {language === 'nl'
                        ? 'Nog geen aanvragen ontvangen. Dien een testaanvraag in via de 3D Studio.'
                        : 'No customer enquiries submitted yet. Submit one in the 3D Studio to test.'}
                    </div>
                  ) : (
                    enquiries.map((enq) => (
                      <div
                        key={enq.id}
                        className="rounded-sm border border-[#E3DCD1] bg-white p-5 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3DCD1] pb-3">
                          <div>
                            <span className="font-mono text-xs font-semibold text-[#23201E]">
                              {enq.reference}
                            </span>
                            <span className="mx-2 text-[#E3DCD1]">·</span>
                            <span className="text-sm font-medium text-[#23201E]">
                              {enq.config.customerName}
                            </span>
                            <span className="mx-2 text-[#E3DCD1]">·</span>
                            <span className="text-xs text-[#6B645E]">
                              {enq.config.customerEmail} / {enq.config.customerPhone}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={enq.status}
                              onChange={(e) =>
                                handleUpdateEnquiryStatus(
                                  enq.id,
                                  e.target.value as EnquiryStatus
                                )
                              }
                              className="rounded-sm border border-[#E3DCD1] bg-[#FAF7F2] px-2.5 py-1.5 text-xs text-[#23201E]"
                            >
                              <option value="new">New</option>
                              <option value="reviewing">Reviewing</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => handleDeleteEnquiry(enq.id)}
                              aria-label="Delete enquiry"
                              className="rounded-sm border border-[#E3DCD1] p-1.5 text-[#6B645E] hover:text-[#9E524E]"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 text-xs text-[#6B645E] sm:grid-cols-3">
                          <div>
                            <strong className="text-[#23201E]">Stijl / Inhoud:</strong>{' '}
                            {enq.config.styleId}
                            {enq.config.selectedPlushId ? ` + ${enq.config.selectedPlushId}` : ''}
                            {enq.config.selectedOutfitId ? ` + ${enq.config.selectedOutfitId}` : ''}
                            {enq.config.includeMoneygift ? ` + money(${enq.config.moneySlots})` : ''}
                          </div>
                          <div>
                            <strong className="text-[#23201E]">Vinyl:</strong>{' '}
                            {enq.config.balloonLine1 || '-'} ({enq.config.balloonTint ?? 'clear'},{' '}
                            {enq.config.vinylColor}, {enq.config.ribbonColor})
                          </div>
                          <div>
                            <strong className="text-[#23201E]">Levering:</strong>{' '}
                            {enq.config.fulfilment === 'pickup'
                              ? `Pickup ${enq.config.pickupCity} (${enq.config.pickupTimeSlot})`
                              : `Ship ${enq.config.shippingCountry}: ${enq.config.shippingCity}`}{' '}
                            · €{(enq.estimatedTotalEur ?? 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: CATALOGUE, IMAGES & PRICES */}
              {activeTab === 'catalog' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-3 font-serif-display text-xl text-[#23201E]">
                      {language === 'nl' ? 'Stap 1 — Cadeaustijlen' : 'Step 1 — Gift Styles'}
                    </h3>
                    <div className="space-y-3">
                      {styles.map((style) => (
                        <div
                          key={style.id}
                          className="grid grid-cols-1 items-center gap-4 rounded-sm border border-[#E3DCD1] bg-white p-4 sm:grid-cols-12"
                        >
                          <div className="flex items-center gap-3 sm:col-span-5">
                            <img
                              src={style.imageUrl}
                              alt={style.name[language]}
                              referrerPolicy="no-referrer"
                              className="h-14 w-16 shrink-0 rounded-sm object-cover"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-[#23201E]">
                                {style.name[language]}
                              </p>
                              <label className="mt-1 inline-flex cursor-pointer items-center gap-1 text-[11px] text-[#6C8396] hover:underline">
                                <Upload className="h-3 w-3" aria-hidden="true" />
                                <span>{language === 'nl' ? 'Nieuwe foto' : 'Upload photo'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleUploadImage(file, (url) =>
                                        handleUpdateStyle(style.id, { imageUrl: url })
                                      );
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[11px] text-[#6B645E]">Demo EUR</label>
                            <input
                              type="number"
                              min={0}
                              step="1"
                              defaultValue={style.demoPriceEur}
                              onBlur={(e) =>
                                handleUpdateStyle(style.id, {
                                  demoPriceEur: Number(e.target.value),
                                })
                              }
                              className="mt-1 w-full rounded-sm border border-[#E3DCD1] px-2.5 py-1.5 text-xs tabular-nums"
                            />
                          </div>

                          <div className="flex items-center gap-4 sm:col-span-5">
                            <label className="flex items-center gap-1.5 text-xs text-[#23201E]">
                              <input
                                type="checkbox"
                                checked={style.shippable}
                                onChange={(e) =>
                                  handleUpdateStyle(style.id, { shippable: e.target.checked })
                                }
                              />
                              <span>{language === 'nl' ? 'Verzendbaar' : 'Shippable'}</span>
                            </label>
                            <label className="flex items-center gap-1.5 text-xs text-[#23201E]">
                              <input
                                type="checkbox"
                                checked={style.inStock}
                                onChange={(e) =>
                                  handleUpdateStyle(style.id, { inStock: e.target.checked })
                                }
                              />
                              <span>{language === 'nl' ? 'Beschikbaar' : 'Available'}</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 font-serif-display text-xl text-[#23201E]">
                      {language === 'nl' ? 'Stap 2 — Inhoud Opties' : 'Step 2 — Inside Options'}
                    </h3>
                    <div className="space-y-3">
                      {insideOptions.map((item) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-1 items-center gap-4 rounded-sm border border-[#E3DCD1] bg-white p-4 sm:grid-cols-12"
                        >
                          <div className="flex items-center gap-3 sm:col-span-6">
                            <img
                              src={item.imageUrl}
                              alt={item.name[language]}
                              referrerPolicy="no-referrer"
                              className="h-14 w-16 shrink-0 rounded-sm object-cover"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-[#23201E]">
                                {item.name[language]}
                              </p>
                              <label className="mt-1 inline-flex cursor-pointer items-center gap-1 text-[11px] text-[#6C8396] hover:underline">
                                <Upload className="h-3 w-3" aria-hidden="true" />
                                <span>{language === 'nl' ? 'Nieuwe foto' : 'Upload photo'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleUploadImage(file, (url) =>
                                        handleUpdateInside(item.id, { imageUrl: url })
                                      );
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-[11px] text-[#6B645E]">Demo +EUR</label>
                            <input
                              type="number"
                              min={0}
                              step="1"
                              defaultValue={item.demoPriceEur}
                              onBlur={(e) =>
                                handleUpdateInside(item.id, {
                                  demoPriceEur: Number(e.target.value),
                                })
                              }
                              className="mt-1 w-full rounded-sm border border-[#E3DCD1] px-2.5 py-1.5 text-xs tabular-nums"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="flex items-center gap-1.5 text-xs text-[#23201E]">
                              <input
                                type="checkbox"
                                checked={item.inStock}
                                onChange={(e) =>
                                  handleUpdateInside(item.id, { inStock: e.target.checked })
                                }
                              />
                              <span>{language === 'nl' ? 'Beschikbaar' : 'Available'}</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SHIPPING & CONTACT SETTINGS */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl space-y-6 rounded-sm border border-[#E3DCD1] bg-white p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-[#23201E]">
                        Verzendtarief Nederland (EUR, leeg = op aanvraag)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        min={0}
                        value={localSettings.shippingRateNL ?? ''}
                        onChange={(e) =>
                          setLocalSettings((p) => ({
                            ...p,
                            shippingRateNL:
                              e.target.value === '' ? null : Number(e.target.value),
                          }))
                        }
                        placeholder="Op aanvraag"
                        className="mt-1 w-full rounded-sm border border-[#E3DCD1] px-3 py-2 text-sm tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#23201E]">
                        Verzendtarief België (EUR, leeg = op aanvraag)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        min={0}
                        value={localSettings.shippingRateBE ?? ''}
                        onChange={(e) =>
                          setLocalSettings((p) => ({
                            ...p,
                            shippingRateBE:
                              e.target.value === '' ? null : Number(e.target.value),
                          }))
                        }
                        placeholder="Op aanvraag"
                        className="mt-1 w-full rounded-sm border border-[#E3DCD1] px-3 py-2 text-sm tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-[#23201E]">
                        WhatsApp nummer (optioneel, bijv. 316...)
                      </label>
                      <input
                        type="text"
                        value={localSettings.whatsappNumber}
                        onChange={(e) =>
                          setLocalSettings((p) => ({ ...p, whatsappNumber: e.target.value }))
                        }
                        placeholder="Nog niet ingesteld"
                        className="mt-1 w-full rounded-sm border border-[#E3DCD1] px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#23201E]">
                        Atelier E-mail (optioneel)
                      </label>
                      <input
                        type="email"
                        value={localSettings.contactEmail}
                        onChange={(e) =>
                          setLocalSettings((p) => ({ ...p, contactEmail: e.target.value }))
                        }
                        placeholder="Nog niet ingesteld"
                        className="mt-1 w-full rounded-sm border border-[#E3DCD1] px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="rounded-sm bg-[#23201E] px-6 py-3 text-xs font-medium tracking-[0.12em] text-[#FAF7F2] uppercase hover:bg-[#6C8396]"
                  >
                    {language === 'nl' ? 'Instellingen opslaan' : 'Save Settings'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
