import { useState } from 'react';

type PriceRule = { id: string; name: string; type: 'peak' | 'off_peak'; multiplier: number; start: string; end: string };

const DEMO_RULES: PriceRule[] = [
  { id: '1', name: 'Lunch peak', type: 'peak', multiplier: 1.1, start: '11:00', end: '15:00' },
  { id: '2', name: 'Dinner peak', type: 'peak', multiplier: 1.15, start: '19:00', end: '22:00' },
];

export default function PriceManagement() {
  const [period, setPeriod] = useState<'7' | '30'>('7');
  const [rules] = useState<PriceRule[]>(DEMO_RULES);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">Price management</h2>

      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Demand-based price rules</h3>
        <p className="text-slate-600 text-sm mb-4">
          Schedule automatic price changes by time window. Peak hours use a multiplier; off-peak can use a discount.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 font-medium text-slate-700">Rule</th>
                <th className="text-left py-2 font-medium text-slate-700">Type</th>
                <th className="text-left py-2 font-medium text-slate-700">Multiplier</th>
                <th className="text-left py-2 font-medium text-slate-700">Time</th>
                <th className="text-right py-2 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="py-2 text-slate-800">{r.name}</td>
                  <td className="py-2 text-slate-600 capitalize">{r.type.replace('_', ' ')}</td>
                  <td className="py-2 text-slate-800">×{r.multiplier}</td>
                  <td className="py-2 text-slate-600">{r.start} – {r.end}</td>
                  <td className="py-2 text-right">
                    <button type="button" className="text-amber-600 hover:underline text-xs">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="mt-4 rounded-lg bg-amber-600 px-4 py-2 text-sm text-white hover:bg-amber-700">
          + Add rule
        </button>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-medium text-slate-700 mb-3">AI suggested price changes</h3>
        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={() => setPeriod('7')}
            className={`px-3 py-1.5 rounded-lg text-sm ${period === '7' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}
          >
            Last 7 days
          </button>
          <button
            type="button"
            onClick={() => setPeriod('30')}
            className={`px-3 py-1.5 rounded-lg text-sm ${period === '30' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}
          >
            Last 30 days
          </button>
        </div>
        <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
          <div className="p-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-slate-800">Chicken Biryani</p>
              <p className="text-xs text-slate-500">High demand at dinner – suggest +5%</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="text-sm text-slate-600 hover:underline">Reject</button>
              <button type="button" className="text-sm text-amber-600 font-medium">Apply</button>
            </div>
          </div>
          <div className="p-3 flex justify-between items-center">
            <div>
              <p className="font-medium text-slate-800">Raita</p>
              <p className="text-xs text-slate-500">Low uptake – suggest −10% to boost orders</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="text-sm text-slate-600 hover:underline">Reject</button>
              <button type="button" className="text-sm text-amber-600 font-medium">Apply</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
