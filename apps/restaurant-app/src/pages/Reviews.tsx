import { useState } from 'react';

type Review = { id: string; userName: string; rating: number; comment: string; reply?: string; createdAt: string };

const DEMO: Review[] = [
  { id: '1', userName: 'Guest', rating: 5, comment: 'Amazing biryani!', reply: 'Thank you!', createdAt: '2025-02-18T12:00:00Z' },
  { id: '2', userName: 'Guest', rating: 4, comment: 'Good but delivery was late.', createdAt: '2025-02-17T19:30:00Z' },
];

export default function Reviews() {
  const [reviews] = useState<Review[]>(DEMO);
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [aggregate] = useState({ average: 4.5, count: 24 });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-xl font-semibold text-slate-800">Reviews & ratings</h2>
        <select
          aria-label="Filter by rating"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="all">All ratings</option>
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars and below</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-8">
        <div className="text-center">
          <p className="text-3xl font-bold text-slate-800">{aggregate.average}</p>
          <p className="text-sm text-slate-500">Average rating</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-slate-800">{aggregate.count}</p>
          <p className="text-sm text-slate-500">Total reviews</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-slate-800">{r.userName}</p>
                <p className="text-amber-600 text-sm mt-0.5">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                <p className="text-slate-600 text-sm mt-2">{r.comment}</p>
                {r.reply && (
                  <div className="mt-3 pl-3 border-l-2 border-amber-200">
                    <p className="text-xs text-slate-500 font-medium">Your reply</p>
                    <p className="text-slate-700 text-sm">{r.reply}</p>
                  </div>
                )}
              </div>
              <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            {!r.reply && (
              <button type="button" className="mt-3 text-sm text-amber-600 hover:underline">Reply</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
