import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { login as apiLogin } from '../api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { accessToken } = await apiLogin(email?.trim() || 'restaurant-demo');
      login(accessToken);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Restaurant login</h2>
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-slate-300 rounded px-3 py-2 mb-4 text-slate-800"
        />
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
