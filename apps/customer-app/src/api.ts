const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_V1 = `${API_BASE}/v1`;

function getAuthHeader(): Record<string, string> {
  const t =
    typeof localStorage !== 'undefined' ? localStorage.getItem('foodbot_access_token') : null;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function submitPrompt(prompt: string): Promise<{ jobId: string }> {
  const res = await fetch(`${API_V1}/chat/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getJobStatus(jobId: string): Promise<{
  status: 'pending' | 'completed' | 'failed';
  messages?: Array<{ role: string; content: string }>;
}> {
  const res = await fetch(`${API_V1}/jobs/${jobId}/status`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function searchRestaurants(
  q?: string,
  type?: string
): Promise<Array<{ id: string; name: string; type: string; address?: string; rating?: number }>> {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (type) params.set('type', type);
  const res = await fetch(`${API_V1}/search/restaurants?${params}`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function searchDishes(
  q?: string,
  type?: string
): Promise<
  Array<{
    id: string;
    restaurantId: string;
    name: string;
    type: string;
    priceCents: number;
    available: boolean;
  }>
> {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (type) params.set('type', type);
  const res = await fetch(`${API_V1}/search/dishes?${params}`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getCart(): Promise<{
  userId: string;
  items: Array<{
    menuItemId: string;
    restaurantId: string;
    name: string;
    quantity: number;
    priceCents: number;
  }>;
  selectedAddressId: string | null;
  totalCents: number;
}> {
  const res = await fetch(`${API_V1}/order-proxy/cart`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addToCart(dto: {
  menuItemId: string;
  restaurantId: string;
  name: string;
  quantity: number;
  priceCents: number;
}): Promise<unknown> {
  const res = await fetch(`${API_V1}/order-proxy/cart/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function checkout(
  selectedAddressId: string
): Promise<{ id: string; status: string; totalCents: number }> {
  const res = await fetch(`${API_V1}/order-proxy/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ selectedAddressId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listOrders(): Promise<
  Array<{
    id: string;
    restaurantName: string;
    status: string;
    totalCents: number;
    createdAt: string;
  }>
> {
  const res = await fetch(`${API_V1}/order-proxy/orders`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function cancelOrder(orderId: string): Promise<unknown> {
  const res = await fetch(`${API_V1}/order-proxy/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
