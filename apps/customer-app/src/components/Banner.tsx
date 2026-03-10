import { useState } from 'react';

type BannerItem = { id: string; title: string; body: string; ctaLabel?: string; ctaUrl?: string; imageUrl?: string };

const DEMO_BANNERS: BannerItem[] = [
  { id: '1', title: 'Weekend brunch 25% off', body: 'Use code BRUNCH25. Valid Sat–Sun.', ctaLabel: 'Order now', ctaUrl: '/order' },
  { id: '2', title: 'Free delivery on orders above ₹299', body: 'Limited time offer.', ctaLabel: 'Browse', ctaUrl: '/order' },
];

export default function Banner() {
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());
  const [current, setCurrent] = useState(0);

  const visible = DEMO_BANNERS.filter((b) => !dismissed.has(b.id));
  const banner = visible[current];

  if (!banner) return null;

  const handleDismiss = () => {
    setDismissed((d) => new Set(d).add(banner.id));
    setCurrent((i) => (i >= visible.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2.5 flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{banner.title}</p>
        <p className="text-sm text-emerald-100 truncate">{banner.body}</p>
        {banner.ctaLabel && banner.ctaUrl && (
          <a href={banner.ctaUrl} className="inline-block mt-1 text-sm font-medium underline">
            {banner.ctaLabel}
          </a>
        )}
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss banner"
        className="shrink-0 p-1 rounded hover:bg-white/20"
      >
        ×
      </button>
    </div>
  );
}
