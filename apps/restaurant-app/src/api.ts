const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_V1 = `${API_BASE}/v1`;

function getAuthHeader(): Record<string, string> {
  const t =
    typeof localStorage !== 'undefined' ? localStorage.getItem('foodbot_restaurant_token') : null;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function login(email?: string): Promise<{ accessToken: string }> {
  const res = await fetch(`${API_V1}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email || 'restaurant-demo' }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export { getAuthHeader };
