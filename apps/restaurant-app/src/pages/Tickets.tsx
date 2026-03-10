import { useState } from 'react';

type TicketStatus = 'open' | 'in_progress' | 'resolved';

type Ticket = { id: string; subject: string; category: string; status: TicketStatus; createdAt: string; messageCount: number };

const DEMO: Ticket[] = [
  { id: 'ticket-1', subject: 'Wrong item delivered', category: 'Order issue', status: 'in_progress', createdAt: '2025-02-20T10:00:00Z', messageCount: 3 },
  { id: 'ticket-2', subject: 'Refund request', category: 'Payment', status: 'open', createdAt: '2025-02-20T11:30:00Z', messageCount: 1 },
];

const STATUS_COLOR: Record<TicketStatus, string> = {
  open: 'bg-amber-100 text-amber-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-emerald-100 text-emerald-800',
};

export default function Tickets() {
  const [tickets] = useState<Ticket[]>(DEMO);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = statusFilter === 'all' ? tickets : tickets.filter((t) => t.status === statusFilter);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">Tickets</h2>

      <div className="flex gap-3">
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 font-medium text-slate-700">ID</th>
              <th className="text-left p-3 font-medium text-slate-700">Subject</th>
              <th className="text-left p-3 font-medium text-slate-700">Category</th>
              <th className="text-left p-3 font-medium text-slate-700">Status</th>
              <th className="text-left p-3 font-medium text-slate-700">Created</th>
              <th className="text-right p-3 font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                <td className="p-3 font-mono text-slate-600">{t.id}</td>
                <td className="p-3 font-medium text-slate-800">{t.subject}</td>
                <td className="p-3 text-slate-600">{t.category}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[t.status]}`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-3 text-slate-600">{new Date(t.createdAt).toLocaleDateString()}</td>
                <td className="p-3 text-right">
                  <button type="button" onClick={() => setSelectedId(t.id)} className="text-amber-600 hover:underline">
                    View & reply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-6 text-center text-slate-500">No tickets match the filter.</p>}
      </div>

      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedId(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Ticket {selectedId}</h3>
              <p className="text-sm text-slate-500">Thread and reply below. Status can be updated.</p>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <p className="text-slate-600 text-sm">Customer: Wrong item was delivered – I ordered veg pulao.</p>
              <p className="text-xs text-slate-400 mt-1">20 Feb 2025, 10:00</p>
              <p className="text-slate-600 text-sm mt-3">Restaurant: We’re sorry. We’ll send the correct item. Refund for the wrong item initiated.</p>
              <p className="text-xs text-slate-400 mt-1">20 Feb 2025, 10:15</p>
            </div>
            <div className="p-4 border-t border-slate-200 flex gap-2">
              <input type="text" placeholder="Type your reply..." className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              <button type="button" className="rounded-lg bg-amber-600 px-4 py-2 text-sm text-white hover:bg-amber-700">Send</button>
              <button type="button" onClick={() => setSelectedId(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
