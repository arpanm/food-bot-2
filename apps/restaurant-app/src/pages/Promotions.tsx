import { useState } from 'react';

type Promo = { id: string; name: string; type: string; value: string; code: string; start: string; end: string; active: boolean };

const DEMO: Promo[] = [
  { id: '1', name: 'Lunch 20% off', type: 'percent_off', value: '20%', code: 'LUNCH20', start: '2025-02-01', end: '2025-02-28', active: true },
  { id: '2', name: '₹50 off', type: 'amount_off', value: '₹50', code: 'FLAT50', start: '2025-02-10', end: '2025-02-15', active: false },
];

export default function Promotions() {
  const [promos] = useState<Promo[]>(DEMO);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Promotions</h2>
        <button type="button" className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
          + Create promotion
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 font-medium text-slate-700">Name</th>
              <th className="text-left p-3 font-medium text-slate-700">Type</th>
              <th className="text-left p-3 font-medium text-slate-700">Value</th>
              <th className="text-left p-3 font-medium text-slate-700">Code</th>
              <th className="text-left p-3 font-medium text-slate-700">Schedule</th>
              <th className="text-left p-3 font-medium text-slate-700">Status</th>
              <th className="text-right p-3 font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="p-3 font-medium text-slate-800">{p.name}</td>
                <td className="p-3 text-slate-600">{p.type}</td>
                <td className="p-3 text-slate-800">{p.value}</td>
                <td className="p-3 font-mono text-slate-600">{p.code}</td>
                <td className="p-3 text-slate-600">{p.start} – {p.end}</td>
                <td className="p-3">
                  <span className={p.active ? 'text-emerald-600 font-medium' : 'text-slate-400'}>{p.active ? 'Active' : 'Inactive'}</span>
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
    </div>
  );
}
