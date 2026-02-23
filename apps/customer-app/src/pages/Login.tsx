import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_V1 = `${API_BASE}/v1`;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_V1}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || 'anonymous', password }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { accessToken } = await res.json();
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
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-slate-300 rounded px-3 py-2 mb-3 text-slate-800"
        />
        <input
          type="password"
          placeholder="Password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-slate-300 rounded px-3 py-2 mb-4 text-slate-800"
        />
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
