import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Login from './pages/Login';

const TABS = ['Dashboard', 'Menu', 'Orders', 'Analytics'] as const;

const MENU_ITEMS = [
  { id: '1', name: 'Chicken Biryani', category: 'Main', price: 250, available: true },
  { id: '2', name: 'Veg Pulao', category: 'Main', price: 180, available: true },
  { id: '3', name: 'Raita', category: 'Sides', price: 60, available: false },
  { id: '4', name: 'Gulab Jamun', category: 'Dessert', price: 80, available: true },
];

const ORDERS = [
  { id: 'ord-101', items: '2x Biryani, 1x Raita', status: 'preparing', time: '12:34' },
  { id: 'ord-102', items: '1x Pulao', status: 'placed', time: '12:40' },
  { id: 'ord-103', items: '3x Biryani, 2x Gulab Jamun', status: 'out_for_delivery', time: '12:20' },
];

function RestaurantDashboard() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Dashboard');
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-800">Food Bot – Restaurant</h1>
        <nav className="flex gap-4 mt-2 items-center flex-wrap">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`text-sm font-medium ${tab === t ? 'text-amber-600' : 'text-slate-600 hover:text-slate-900'}`}
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

      <main className="p-4 max-w-4xl mx-auto">
        {tab === 'Dashboard' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-slate-500 text-sm">Orders today</p>
                <p className="text-2xl font-semibold text-slate-800">24</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-slate-500 text-sm">Revenue today</p>
                <p className="text-2xl font-semibold text-slate-800">₹6,420</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-slate-500 text-sm">Pending orders</p>
                <p className="text-2xl font-semibold text-amber-600">3</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'Menu' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Menu</h2>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 font-medium text-slate-700">Name</th>
                    <th className="text-left p-3 font-medium text-slate-700">Category</th>
                    <th className="text-left p-3 font-medium text-slate-700">Price</th>
                    <th className="text-left p-3 font-medium text-slate-700">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {MENU_ITEMS.map((item) => (
                    <tr key={item.id} className="border-t border-slate-100">
                      <td className="p-3 text-slate-800">{item.name}</td>
                      <td className="p-3 text-slate-600">{item.category}</td>
                      <td className="p-3 text-slate-800">₹{item.price}</td>
                      <td className="p-3">
                        <span className={item.available ? 'text-emerald-600' : 'text-slate-400'}>
                          {item.available ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'Orders' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Orders</h2>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 font-medium text-slate-700">Order ID</th>
                    <th className="text-left p-3 font-medium text-slate-700">Items</th>
                    <th className="text-left p-3 font-medium text-slate-700">Status</th>
                    <th className="text-left p-3 font-medium text-slate-700">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {ORDERS.map((order) => (
                    <tr key={order.id} className="border-t border-slate-100">
                      <td className="p-3 text-slate-800 font-mono">{order.id}</td>
                      <td className="p-3 text-slate-600">{order.items}</td>
                      <td className="p-3">
                        <span className="capitalize text-amber-700">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'Analytics' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Analytics</h2>
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <p className="text-slate-600 text-sm mb-4">
                Revenue and popular items (last 7 days). Charts and filters coming soon.
              </p>
              <div className="flex gap-4 items-end h-32">
                {[65, 80, 45, 90, 70, 85, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-amber-200 rounded-t min-h-[20px]"
                    style={{ height: `${h}%` }}
                    title={`Day ${i + 1}`}
                  />
                ))}
              </div>
              <p className="text-slate-500 text-xs mt-2">Mon – Sun</p>
            </div>
          </div>
        )}
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
