import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../api';

const STATUS_LABELS: Record<string, string> = {
  placed: 'Order placed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<{
    id: string;
    restaurantName: string;
    status: string;
    totalCents: number;
    createdAt: string;
    timeline?: Array<{ status: string; at: string }>;
    eta?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    getOrder(orderId)
      .then(setOrder)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load order'));
  }, [orderId]);

  if (error) {
    return (
      <div className="max-w-lg mx-auto">
        <p className="text-red-600">{error}</p>
        <Link to="/order" className="text-emerald-600 hover:underline mt-2 inline-block">Back to orders</Link>
      </div>
    );
  }

  if (!order) {
    return <div className="max-w-lg mx-auto text-slate-500">Loading order…</div>;
  }

  const timeline = order.timeline || [{ status: order.status, at: order.createdAt }];

  return (
    <div className="max-w-lg mx-auto">
      <Link to="/order" className="text-sm text-emerald-600 hover:underline mb-4 inline-block">← Back to orders</Link>
      <h2 className="text-xl font-semibold text-slate-800">Order {order.id}</h2>
      <p className="text-slate-600 text-sm mt-1">{order.restaurantName} · ₹{(order.totalCents / 100).toFixed(0)}</p>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Status</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${
            order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
            order.status === 'cancelled' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800'
          }`}>
            {STATUS_LABELS[order.status] || order.status}
          </span>
          {order.eta && <span className="text-slate-500 text-sm">ETA: {new Date(order.eta).toLocaleString()}</span>}
        </div>

        <ul className="space-y-4 border-l-2 border-slate-200 pl-4 ml-1">
          {timeline.map((e, i) => (
            <li key={i} className="relative -left-[21px]">
              <span className="absolute w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              <p className="text-slate-800 font-medium text-sm">{STATUS_LABELS[e.status] || e.status}</p>
              <p className="text-slate-500 text-xs">{new Date(e.at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
