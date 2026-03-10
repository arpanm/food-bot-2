import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  searchRestaurants,
  searchDishes,
  getCart,
  addToCart,
  checkout,
  listOrders,
  cancelOrder,
} from '../api';

type Tab = 'search' | 'cart' | 'orders';

export default function Order() {
  const [tab, setTab] = useState<Tab>('search');
  const [searchQ, setSearchQ] = useState('');
  const [restaurants, setRestaurants] = useState<
    Array<{ id: string; name: string; type: string; address?: string; rating?: number }>
  >([]);
  const [dishes, setDishes] = useState<
    Array<{
      id: string;
      restaurantId: string;
      name: string;
      type: string;
      priceCents: number;
      available: boolean;
    }>
  >([]);
  const [cart, setCart] = useState<{
    items: Array<{
      menuItemId: string;
      restaurantId: string;
      name: string;
      quantity: number;
      priceCents: number;
    }>;
    totalCents: number;
    selectedAddressId: string | null;
  } | null>(null);
  const [orders, setOrders] = useState<
    Array<{
      id: string;
      restaurantName: string;
      status: string;
      totalCents: number;
      createdAt: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutAddress, setCheckoutAddress] = useState('addr-1');

  const loadSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const [r, d] = await Promise.all([searchRestaurants(searchQ), searchDishes(searchQ)]);
      setRestaurants(r);
      setDishes(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const c = await getCart();
      setCart({
        items: c.items,
        totalCents: c.totalCents,
        selectedAddressId: c.selectedAddressId,
      });
    } catch {
      setCart(null);
    }
  };

  const loadOrders = async () => {
    try {
      const o = await listOrders();
      setOrders(o);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    if (tab === 'cart') loadCart();
  }, [tab]);
  useEffect(() => {
    if (tab === 'orders') loadOrders();
  }, [tab]);

  const handleAddToCart = async (dish: {
    id: string;
    restaurantId: string;
    name: string;
    priceCents: number;
  }) => {
    setError(null);
    try {
      await addToCart({
        menuItemId: dish.id,
        restaurantId: dish.restaurantId,
        name: dish.name,
        quantity: 1,
        priceCents: dish.priceCents,
      });
      loadCart();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Add to cart failed');
    }
  };

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);
    try {
      await checkout(checkoutAddress);
      setCart(null);
      loadCart();
      setTab('orders');
      loadOrders();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setError(null);
    try {
      await cancelOrder(orderId);
      loadOrders();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cancel failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Order food</h2>
      <div className="flex gap-2 mb-4 border-b border-slate-200">
        {(['search', 'cart', 'orders'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm font-medium capitalize ${tab === t ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-600'}`}
          >
            {t}
          </button>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      {tab === 'search' && (
        <>
          <div className="flex gap-2 mb-4">
            <input
              type="search"
              aria-label="Search restaurants or dishes"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadSearch()}
              placeholder="Search restaurants or dishes"
              className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={loadSearch}
              disabled={loading}
              className="rounded bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              Search
            </button>
          </div>
          {restaurants.length > 0 && (
            <section className="mb-4">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Restaurants</h3>
              <ul className="space-y-2">
                {restaurants.map((r) => (
                  <li key={r.id} className="bg-white border border-slate-200 rounded p-2 text-sm">
                    {r.name} – {r.type} {r.rating != null && `(${r.rating})`}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {dishes.length > 0 && (
            <section>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Dishes</h3>
              <ul className="space-y-2">
                {dishes.map((d) => (
                  <li
                    key={d.id}
                    className="flex justify-between items-center bg-white border border-slate-200 rounded p-2 text-sm"
                  >
                    <span>
                      {d.name} – ₹{(d.priceCents / 100).toFixed(0)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(d)}
                      className="text-emerald-600 font-medium"
                    >
                      Add to cart
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {tab === 'cart' && (
        <>
          {cart && cart.items.length > 0 ? (
            <>
              <ul className="space-y-2 mb-4">
                {cart.items.map((item) => (
                  <li
                    key={`${item.menuItemId}-${item.restaurantId}`}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{((item.quantity * item.priceCents) / 100).toFixed(0)}</span>
                  </li>
                ))}
              </ul>
              <p className="font-medium text-slate-800 mb-2">
                Total: ₹{(cart.totalCents / 100).toFixed(0)}
              </p>
              <div className="mb-2">
                <label htmlFor="order-checkout-address" className="text-sm text-slate-600">
                  Address ID (stub)
                </label>
                <input
                  id="order-checkout-address"
                  type="text"
                  value={checkoutAddress}
                  onChange={(e) => setCheckoutAddress(e.target.value)}
                  className="block w-full rounded border border-slate-300 px-3 py-2 text-sm mt-1"
                />
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="rounded bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Checkout
              </button>
            </>
          ) : (
            <p className="text-slate-600 text-sm">Cart is empty. Search and add dishes.</p>
          )}
        </>
      )}

      {tab === 'orders' && (
        <>
          {orders.length > 0 ? (
            <ul className="space-y-3">
              {orders.map((o) => (
                <li key={o.id} className="bg-white border border-slate-200 rounded p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{o.restaurantName}</span>
                    <span className="text-slate-600">{o.status}</span>
                  </div>
                  <div className="mt-1 text-slate-600">
                    ₹{(o.totalCents / 100).toFixed(0)} ·{' '}
                    {new Date(o.createdAt).toLocaleDateString()}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Link to={`/order/track/${o.id}`} className="text-emerald-600 text-sm hover:underline">
                      Track order
                    </Link>
                    {o.status === 'placed' && (
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(o.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Cancel order
                    </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600 text-sm">No orders yet.</p>
          )}
        </>
      )}
    </div>
  );
}
