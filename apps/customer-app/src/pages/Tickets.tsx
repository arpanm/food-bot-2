import { useState, useEffect } from 'react';
import { listTickets, getTicket, createTicket, replyTicket } from '../api';

type Ticket = { id: string; subject: string; category: string; status: string; createdAt: string };

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ id: string; subject: string; messages: Array<{ sender: string; body: string; at: string }> } | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ subject: '', category: 'Order issue', message: '' });

  useEffect(() => {
    listTickets()
      .then(setTickets)
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!detailId) {
      setDetail(null);
      return;
    }
    getTicket(detailId)
      .then(setDetail)
      .catch(() => setDetail(null));
  }, [detailId]);

  const handleCreate = async () => {
    if (!createForm.subject.trim() || !createForm.message.trim()) return;
    setError(null);
    try {
      await createTicket(createForm);
      setShowCreate(false);
      setCreateForm({ subject: '', category: 'Order issue', message: '' });
      const next = await listTickets();
      setTickets(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create ticket');
    }
  };

  const handleReply = async () => {
    if (!detailId || !replyText.trim()) return;
    setError(null);
    try {
      await replyTicket(detailId, replyText.trim());
      setReplyText('');
      const updated = await getTicket(detailId);
      setDetail(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send reply');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-slate-800">Support tickets</h2>
      <p className="text-slate-600 text-sm mt-1">Create a ticket or view and reply to existing ones.</p>

      <button
        type="button"
        onClick={() => setShowCreate(true)}
        className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        + Create ticket
      </button>

      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}

      {loading ? (
        <p className="mt-4 text-slate-500">Loading…</p>
      ) : (
        <div className="mt-6 space-y-2">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-slate-800">{t.subject}</p>
                <p className="text-slate-500 text-sm">{t.category} · {t.status}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailId(t.id)}
                className="text-emerald-600 hover:underline text-sm"
              >
                View
              </button>
            </div>
          ))}
          {tickets.length === 0 && !showCreate && <p className="text-slate-500 text-sm">No tickets yet.</p>}
        </div>
      )}

      {showCreate && (
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="font-medium text-slate-800">New ticket</h3>
          <div className="mt-3 space-y-3">
            <input
              type="text"
              placeholder="Subject"
              value={createForm.subject}
              onChange={(e) => setCreateForm((f) => ({ ...f, subject: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <select
              value={createForm.category}
              onChange={(e) => setCreateForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="Order issue">Order issue</option>
              <option value="Payment">Payment</option>
              <option value="General">General</option>
            </select>
            <textarea
              placeholder="Message"
              value={createForm.message}
              onChange={(e) => setCreateForm((f) => ({ ...f, message: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Cancel</button>
              <button type="button" onClick={handleCreate} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700">Create</button>
            </div>
          </div>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDetailId(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">{detail.subject}</h3>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {detail.messages?.map((m, i) => (
                <div key={i} className={m.sender === 'customer' ? 'text-right' : 'text-left'}>
                  <p className={`inline-block rounded-lg px-3 py-2 text-sm max-w-[85%] ${m.sender === 'customer' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                    {m.body}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(m.at).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <button type="button" onClick={handleReply} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700">Send</button>
              <button type="button" onClick={() => setDetailId(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}