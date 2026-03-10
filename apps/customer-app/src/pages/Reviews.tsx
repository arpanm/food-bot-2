import { useState } from 'react';

type Review = { id: string; restaurantName: string; rating: number; comment: string; createdAt: string };

const DEMO_MY_REVIEWS: Review[] = [
  { id: '1', restaurantName: 'Biryani House', rating: 5, comment: 'Great food!', createdAt: '2025-02-18T12:00:00Z' },
];

export default function Reviews() {
  const [reviews] = useState<Review[]>(DEMO_MY_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ restaurantId: '1', orderId: '', rating: 5, comment: '' });

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-slate-800">My reviews</h2>
      <p className="text-slate-600 text-sm mt-1">Rate and review your orders.</p>

      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        + Write a review
      </button>

      <div className="mt-6 space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="font-medium text-slate-800">{r.restaurantName}</p>
            <p className="text-amber-600 text-sm mt-0.5">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
            <p className="text-slate-600 text-sm mt-2">{r.comment}</p>
            <p className="text-slate-400 text-xs mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
        {reviews.length === 0 && !showForm && <p className="text-slate-500 text-sm">You haven’t written any reviews yet.</p>}
      </div>

      {showForm && (
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h3 className="font-medium text-slate-800">Write a review</h3>
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-sm text-slate-700 mb-1">Rating</label>
              <select
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-1">Comment</label>
              <textarea
                value={form.comment}
                onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Share your experience..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
