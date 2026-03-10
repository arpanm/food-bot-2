import { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Login from './pages/Login';
import PriceManagement from './pages/PriceManagement';
import Promotions from './pages/Promotions';
import Marketing from './pages/Marketing';
import Reviews from './pages/Reviews';
import Tickets from './pages/Tickets';

const TABS = ['Dashboard', 'Menu', 'Orders', 'Analytics', 'Price', 'Promotions', 'Marketing', 'Reviews', 'Tickets'] as const;

type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  available: boolean;
  imageUrl?: string;
};

type OrderStatus = 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

type TimelineEvent = { status: OrderStatus; at: string; note?: string };

type Order = {
  id: string;
  items: string;
  itemsDetail: { name: string; qty: number; price: number }[];
  status: OrderStatus;
  time: string;
  total: number;
  customerNote?: string;
  customerName?: string;
  customerPhone?: string;
  timeline?: TimelineEvent[];
  atRisk?: boolean;
};

const MENU_ITEMS_INIT: MenuItem[] = [
  { id: '1', name: 'Chicken Biryani', description: 'Fragrant basmati rice with tender chicken', category: 'Main', price: 250, available: true, imageUrl: '' },
  { id: '2', name: 'Veg Pulao', description: 'Mixed vegetable rice', category: 'Main', price: 180, available: true, imageUrl: '' },
  { id: '3', name: 'Raita', description: 'Cooling yogurt side', category: 'Sides', price: 60, available: false, imageUrl: '' },
  { id: '4', name: 'Gulab Jamun', description: '2 pieces, warm', category: 'Dessert', price: 80, available: true, imageUrl: '' },
  { id: '5', name: 'Paneer Tikka', description: 'Grilled cottage cheese', category: 'Starter', price: 220, available: true, imageUrl: '' },
];

const ORDERS_INIT: Order[] = [
  { id: 'ord-101', items: '2x Biryani, 1x Raita', itemsDetail: [{ name: 'Chicken Biryani', qty: 2, price: 250 }, { name: 'Raita', qty: 1, price: 60 }], status: 'preparing', time: '12:34', total: 560, customerNote: 'Less spicy', customerName: 'Rahul K.', customerPhone: '+91 98765 43210', timeline: [{ status: 'placed', at: '2025-02-20T12:30:00Z' }, { status: 'preparing', at: '2025-02-20T12:34:00Z' }], atRisk: false },
  { id: 'ord-102', items: '1x Pulao', itemsDetail: [{ name: 'Veg Pulao', qty: 1, price: 180 }], status: 'placed', time: '12:40', total: 180, customerName: 'Priya S.', customerPhone: '+91 91234 56789', timeline: [{ status: 'placed', at: '2025-02-20T12:40:00Z' }], atRisk: true },
  { id: 'ord-103', items: '3x Biryani, 2x Gulab Jamun', itemsDetail: [{ name: 'Chicken Biryani', qty: 3, price: 250 }, { name: 'Gulab Jamun', qty: 2, price: 80 }], status: 'out_for_delivery', time: '12:20', total: 910, customerName: 'Amit R.', customerPhone: '+91 99887 76655', timeline: [{ status: 'placed', at: '2025-02-20T12:00:00Z' }, { status: 'preparing', at: '2025-02-20T12:10:00Z' }, { status: 'out_for_delivery', at: '2025-02-20T12:20:00Z' }], atRisk: false },
  { id: 'ord-104', items: '1x Paneer Tikka', itemsDetail: [{ name: 'Paneer Tikka', qty: 1, price: 220 }], status: 'placed', time: '12:48', total: 220, customerName: 'Neha M.', customerPhone: '+91 98765 11111', timeline: [{ status: 'placed', at: '2025-02-20T12:48:00Z' }], atRisk: false },
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Placed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function DashboardTab({ orders }: { orders: Order[] }) {
  const ordersToday = 24;
  const revenueToday = 6420;
  const pendingCount = orders.filter((o) => o.status === 'placed' || o.status === 'preparing').length;
  const needAttention = orders.filter((o) => o.status === 'placed').length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>

      {/* Alerts */}
      {(needAttention > 0 || pendingCount > 0) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h3 className="text-sm font-medium text-amber-800">Alerts</h3>
          <ul className="mt-2 space-y-1 text-sm text-amber-700">
            {needAttention > 0 && (
              <li>
                <strong>{needAttention}</strong> new order(s) need acceptance.
              </li>
            )}
            {pendingCount > 0 && (
              <li>
                <strong>{pendingCount}</strong> order(s) in progress – ensure kitchen is on track.
              </li>
            )}
          </ul>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Orders today</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">{ordersToday}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Revenue today</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">₹{revenueToday.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-sm bg-amber-50/30">
          <p className="text-amber-700 text-sm font-medium">Pending orders</p>
          <p className="text-2xl font-semibold text-amber-700 mt-1">{pendingCount}</p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-medium text-slate-700">Suggestions</h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          <li>• Peak hour in ~1 hour – ensure staff and inventory are ready.</li>
          <li>• Chicken Biryani is your top seller this week – consider a lunch combo promo.</li>
        </ul>
      </div>
    </div>
  );
}

function MenuTab({
  menuItems,
  onMenuChange,
}: {
  menuItems: MenuItem[];
  onMenuChange: (items: MenuItem[]) => void;
}) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add' | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({ name: '', description: '', category: 'Main', price: '', available: true, imageUrl: '' });

  const categories = useMemo(() => {
    const set = new Set(menuItems.map((i) => i.category));
    return ['all', ...Array.from(set).sort()];
  }, [menuItems]);

  const filtered = useMemo(() => {
    let list = menuItems;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'all') list = list.filter((i) => i.category === categoryFilter);
    return list;
  }, [menuItems, search, categoryFilter]);

  const openView = (item: MenuItem) => {
    setSelectedItem(item);
    setModalMode('view');
  };
  const openEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setForm({ name: item.name, description: item.description, category: item.category, price: String(item.price), available: item.available, imageUrl: item.imageUrl || '' });
    setModalMode('edit');
  };
  const openAdd = () => {
    setSelectedItem(null);
    setForm({ name: '', description: '', category: 'Main', price: '', available: true, imageUrl: '' });
    setModalMode('add');
  };
  const closeModal = () => {
    setModalMode(null);
    setSelectedItem(null);
  };

  const saveEdit = () => {
    if (!selectedItem) return;
    const price = parseInt(form.price, 10);
    if (isNaN(price) || price < 0) return;
    const next = menuItems.map((i) =>
      i.id === selectedItem.id
        ? { ...i, name: form.name, description: form.description, category: form.category, price, available: form.available, imageUrl: form.imageUrl || undefined }
        : i
    );
    onMenuChange(next);
    closeModal();
  };

  const saveAdd = () => {
    const price = parseInt(form.price, 10);
    if (!form.name.trim() || isNaN(price) || price < 0) return;
    const newItem: MenuItem = {
      id: String(menuItems.length + 1),
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price,
      available: form.available,
      imageUrl: form.imageUrl || undefined,
    };
    onMenuChange([...menuItems, newItem]);
    closeModal();
  };

  const toggleAvailability = (item: MenuItem) => {
    onMenuChange(menuItems.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i)));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-800">Menu</h2>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
        >
          + Add item
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          aria-label="Search menu"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <select
          aria-label="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'all' ? 'All categories' : c}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 font-medium text-slate-700 w-14">Image</th>
              <th className="text-left p-3 font-medium text-slate-700">Name</th>
              <th className="text-left p-3 font-medium text-slate-700">Category</th>
              <th className="text-left p-3 font-medium text-slate-700">Price</th>
              <th className="text-left p-3 font-medium text-slate-700">Available</th>
              <th className="text-right p-3 font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                <td className="p-2">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="w-10 h-10 rounded object-cover bg-slate-100" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center text-slate-400 text-xs">—</div>
                  )}
                </td>
                <td className="p-3 font-medium text-slate-800">{item.name}</td>
                <td className="p-3 text-slate-600">{item.category}</td>
                <td className="p-3 text-slate-800">₹{item.price}</td>
                <td className="p-3">
                  <span className={item.available ? 'text-emerald-600 font-medium' : 'text-slate-400'}>
                    {item.available ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button type="button" onClick={() => openView(item)} className="text-amber-600 hover:underline mr-2">
                    View
                  </button>
                  <button type="button" onClick={() => openEdit(item)} className="text-amber-600 hover:underline mr-2">
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAvailability(item)}
                    className="text-slate-600 hover:underline"
                  >
                    {item.available ? 'Mark unavailable' : 'Mark available'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-6 text-center text-slate-500">No items match your search or filter.</p>
        )}
      </div>

      {/* Modal: View / Edit / Add */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-800">
              {modalMode === 'view' ? 'Item details' : modalMode === 'edit' ? 'Edit item' : 'Add new item'}
            </h3>
            {modalMode === 'view' && selectedItem ? (
              <div className="mt-4 space-y-2 text-sm">
                {selectedItem.imageUrl && (
                  <div className="mb-2">
                    <img src={selectedItem.imageUrl} alt="" className="w-full max-h-40 object-cover rounded-lg bg-slate-100" />
                  </div>
                )}
                <p><span className="text-slate-500">Name:</span> {selectedItem.name}</p>
                <p><span className="text-slate-500">Category:</span> {selectedItem.category}</p>
                <p><span className="text-slate-500">Price:</span> ₹{selectedItem.price}</p>
                <p><span className="text-slate-500">Available:</span> {selectedItem.available ? 'Yes' : 'No'}</p>
                {selectedItem.description && <p><span className="text-slate-500">Description:</span> {selectedItem.description}</p>}
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                {modalMode === 'add' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="available"
                      checked={form.available}
                      onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
                      className="rounded border-slate-300"
                    />
                    <label htmlFor="available" className="text-sm text-slate-700">Available</label>
                  </div>
                )}
                {modalMode === 'edit' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="edit-available"
                      checked={form.available}
                      onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
                      className="rounded border-slate-300"
                    />
                    <label htmlFor="edit-available" className="text-sm text-slate-700">Available</label>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={closeModal} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                {modalMode === 'view' ? 'Close' : 'Cancel'}
              </button>
              {modalMode === 'edit' && <button type="button" onClick={saveEdit} className="rounded-lg bg-amber-600 px-4 py-2 text-sm text-white hover:bg-amber-700">Save</button>}
              {modalMode === 'add' && <button type="button" onClick={saveAdd} className="rounded-lg bg-amber-600 px-4 py-2 text-sm text-white hover:bg-amber-700">Add</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTab({ orders, onOrdersChange }: { orders: Order[]; onOrdersChange: (updater: (prev: Order[]) => Order[]) => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    onOrdersChange((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, timeline: [...(o.timeline || []), { status, at: new Date().toISOString() }] } : o))
    );
    setDetailOrder((d) => (d?.id === orderId ? { ...d, status, timeline: [...(d.timeline || []), { status, at: new Date().toISOString() }] } : d));
  };

  const filtered = useMemo(() => {
    let list = orders;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((o) => o.id.toLowerCase().includes(q) || o.items.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') list = list.filter((o) => o.status === statusFilter);
    return list;
  }, [orders, search, statusFilter]);

  const pendingCount = orders.filter((o) => o.status === 'placed').length;
  const atRiskCount = orders.filter((o) => o.atRisk).length;

  const statusColor = (s: OrderStatus) => {
    switch (s) {
      case 'placed': return 'bg-amber-100 text-amber-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Orders</h2>

      {(pendingCount > 0 || atRiskCount > 0) && (
        <div className="space-y-2">
          {pendingCount > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <strong>{pendingCount}</strong> new order(s) waiting for acceptance.
            </div>
          )}
          {atRiskCount > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <strong>{atRiskCount}</strong> order(s) at risk (e.g. placed &gt;15 min without progress). Update status to avoid delay.
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          aria-label="Search orders"
          placeholder="Search by order ID or items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All statuses</option>
          {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 font-medium text-slate-700">Order ID</th>
              <th className="text-left p-3 font-medium text-slate-700">Items</th>
              <th className="text-left p-3 font-medium text-slate-700">Status</th>
              <th className="text-left p-3 font-medium text-slate-700">Time</th>
              <th className="text-right p-3 font-medium text-slate-700">Total</th>
              <th className="text-right p-3 font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className={`border-t border-slate-100 hover:bg-slate-50/50 ${o.atRisk ? 'bg-red-50/50' : ''}`}>
                <td className="p-3 font-mono text-slate-800">{o.id}{o.atRisk && <span className="ml-1 text-red-600 text-xs font-medium">At risk</span>}</td>
                <td className="p-3 text-slate-600 max-w-[180px] truncate">{o.items}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(o.status)}`}>
                    {STATUS_LABELS[o.status]}
                  </span>
                </td>
                <td className="p-3 text-slate-600">{o.time}</td>
                <td className="p-3 text-right font-medium text-slate-800">₹{o.total}</td>
                <td className="p-3 text-right">
                  <button type="button" onClick={() => setDetailOrder(o)} className="text-amber-600 hover:underline">
                    View details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-6 text-center text-slate-500">No orders match your search or filter.</p>
        )}
      </div>

      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto" onClick={() => setDetailOrder(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-auto my-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-slate-800">Order {detailOrder.id}</h3>
              {detailOrder.atRisk && <span className="rounded-full bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5">At risk</span>}
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-slate-500">Status:</span>
                <select
                  value={detailOrder.status}
                  onChange={(e) => updateOrderStatus(detailOrder.id, e.target.value as OrderStatus)}
                  className={`rounded-full px-2 py-1 text-xs font-medium border ${statusColor(detailOrder.status)}`}
                >
                  {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <p><span className="text-slate-500">Time:</span> {detailOrder.time}</p>
              {(detailOrder.customerName || detailOrder.customerPhone) && (
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="font-medium text-slate-700 mb-1">Customer</p>
                  {detailOrder.customerName && <p>{detailOrder.customerName}</p>}
                  {detailOrder.customerPhone && (
                    <div className="flex gap-2 mt-1">
                      <a href={`tel:${detailOrder.customerPhone.replace(/\s/g, '')}`} className="text-amber-600 hover:underline">Call</a>
                      <button type="button" className="text-amber-600 hover:underline">Chat</button>
                    </div>
                  )}
                </div>
              )}
              <p><span className="text-slate-500">Items:</span></p>
              <ul className="list-disc list-inside text-slate-700">
                {detailOrder.itemsDetail.map((line, i) => (
                  <li key={i}>{line.name} × {line.qty} – ₹{line.price * line.qty}</li>
                ))}
              </ul>
              <p className="font-medium">Total: ₹{detailOrder.total}</p>
              {detailOrder.customerNote && <p><span className="text-slate-500">Note:</span> {detailOrder.customerNote}</p>}
              {detailOrder.timeline && detailOrder.timeline.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-slate-500 font-medium mb-1">Timeline</p>
                  <ul className="space-y-0.5 text-slate-600">
                    {detailOrder.timeline.map((e, i) => (
                      <li key={i}>{STATUS_LABELS[e.status]} – {new Date(e.at).toLocaleString()}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setDetailOrder(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyticsTab() {
  const [period, setPeriod] = useState<'7' | '30'>('7');
  const data = period === '7' ? [65, 80, 45, 90, 70, 85, 75] : [60, 72, 68, 85, 78, 82, 88, 75, 90, 70, 65, 80];
  const labels = period === '7' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : Array.from({ length: 12 }, (_, i) => `Day ${i + 1}`);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-800">Analytics</h2>
        <select
          aria-label="Time period"
          value={period}
          onChange={(e) => setPeriod(e.target.value as '7' | '30')}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <p className="text-slate-600 text-sm mb-4">Revenue trend (relative)</p>
        <div className="flex gap-2 items-end h-40">
          {data.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-amber-200 rounded-t min-h-[8px] max-w-[32px] mx-auto"
                style={{ height: `${h}%` }}
                title={`${labels[i]}: ${h}%`}
              />
              <span className="text-xs text-slate-500">{labels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-medium text-slate-700">Suggestions</h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          <li>• Biryani is your top seller – consider a lunch combo or limited-time offer.</li>
          <li>• Weekend revenue is 20% higher – ensure stock and staff for Fri–Sun.</li>
        </ul>
      </div>
    </div>
  );
}

function RestaurantDashboard() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Dashboard');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS_INIT);
  const [orders, setOrders] = useState<Order[]>(ORDERS_INIT);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-800">Food Bot – Restaurant</h1>
        <nav className="flex gap-4 mt-2 items-center flex-wrap">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg ${tab === t ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              {t}
            </button>
          ))}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-slate-600 hover:text-slate-900 ml-auto"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-sm font-medium text-amber-600 ml-auto">
              Login
            </Link>
          )}
        </nav>
      </header>

      <main className="p-4 max-w-5xl mx-auto">
        {tab === 'Dashboard' && <DashboardTab orders={orders} />}
        {tab === 'Menu' && <MenuTab menuItems={menuItems} onMenuChange={setMenuItems} />}
        {tab === 'Orders' && <OrdersTab orders={orders} onOrdersChange={setOrders} />}
        {tab === 'Analytics' && <AnalyticsTab />}
        {tab === 'Price' && <PriceManagement />}
        {tab === 'Promotions' && <Promotions />}
        {tab === 'Marketing' && <Marketing />}
        {tab === 'Reviews' && <Reviews />}
        {tab === 'Tickets' && <Tickets />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RestaurantDashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
