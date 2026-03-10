import { useState } from 'react';

type Channel = 'banner' | 'push' | 'whatsapp' | 'sms' | 'email' | 'facebook_ads' | 'instagram_ads';

type Campaign = { id: string; name: string; title: string; segment: string; channels: Channel[]; start: string; end: string; status: string };

const CHANNEL_LABELS: Record<Channel, string> = {
  banner: 'Banner',
  push: 'Push',
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  email: 'Email',
  facebook_ads: 'Facebook Ads',
  instagram_ads: 'Instagram Ads',
};

const DEMO: Campaign[] = [
  { id: '1', name: 'Weekend brunch', title: '25% off brunch', segment: 'All users', channels: ['banner', 'push'], start: '2025-02-22', end: '2025-02-23', status: 'Scheduled' },
  { id: '2', name: 'New menu launch', title: 'Try our new dishes', segment: 'Ordered last 30 days', channels: ['banner', 'whatsapp', 'email'], start: '2025-03-01', end: '2025-03-07', status: 'Draft' },
];

export default function Marketing() {
  const [campaigns] = useState<Campaign[]>(DEMO);
  const [segmentFilter, setSegmentFilter] = useState<string>('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-xl font-semibold text-slate-800">Marketing campaigns</h2>
        <div className="flex gap-2">
          <select
            aria-label="Filter by segment"
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="all">All segments</option>
            <option value="all_users">All users</option>
            <option value="recent">Ordered last 30 days</option>
          </select>
          <button type="button" className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
            + Create campaign
          </button>
        </div>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Segments</h3>
        <p className="text-slate-600 text-sm mb-4">Create audience segments for targeting (e.g. veg-only, high spenders, inactive users).</p>
        <div className="flex gap-2 flex-wrap">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">All users</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Ordered last 30 days</span>
          <button type="button" className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-sm text-slate-500 hover:border-amber-500">+ New segment</button>
        </div>
      </section>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 font-medium text-slate-700">Campaign</th>
              <th className="text-left p-3 font-medium text-slate-700">Title</th>
              <th className="text-left p-3 font-medium text-slate-700">Segment</th>
              <th className="text-left p-3 font-medium text-slate-700">Channels</th>
              <th className="text-left p-3 font-medium text-slate-700">Schedule</th>
              <th className="text-left p-3 font-medium text-slate-700">Status</th>
              <th className="text-right p-3 font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="p-3 font-medium text-slate-800">{c.name}</td>
                <td className="p-3 text-slate-600">{c.title}</td>
                <td className="p-3 text-slate-600">{c.segment}</td>
                <td className="p-3 text-slate-600">{c.channels.map((ch) => CHANNEL_LABELS[ch]).join(', ')}</td>
                <td className="p-3 text-slate-600">{c.start} – {c.end}</td>
                <td className="p-3">
                  <span className={c.status === 'Scheduled' ? 'text-amber-700' : 'text-slate-500'}>{c.status}</span>
                </td>
                <td className="p-3 text-right">
                  <button type="button" className="text-amber-600 hover:underline mr-2">Edit</button>
                  <button type="button" className="text-slate-600 hover:underline">Duplicate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-medium text-slate-700">Delivery options</h3>
        <p className="text-slate-600 text-sm mt-1">Campaigns can be sent via: In-app banner, Push notification, WhatsApp, SMS, Email, Facebook Ads, Instagram Ads. Configure in each campaign.</p>
      </section>
    </div>
  );
}
