import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Banner from '../components/Banner';
import NotificationPanel from '../components/NotificationPanel';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const nav = [
    { path: '/', label: 'Chat' },
    { path: '/order', label: 'Order' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/tickets', label: 'Tickets' },
    { path: '/party', label: 'Party planner' },
    { path: '/diet', label: 'Diet planner' },
  ];

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-800">Food Bot – Customer</h1>
        <nav className="flex gap-4 mt-2 items-center flex-wrap">
          {nav.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`text-sm font-medium ${location.pathname === path ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {label}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <NotificationPanel />
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-slate-600 hover:text-slate-900 ml-auto"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-sm font-medium text-emerald-600">
              Login
            </Link>
          )}
          </div>
        </nav>
      </header>
      <Banner />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
