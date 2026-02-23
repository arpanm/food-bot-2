export async function searchRestaurants(params: Record<string, unknown>): Promise<unknown> {
  return { restaurants: [], query: params?.query ?? '' };
}

export async function getMenu(params: Record<string, unknown>): Promise<unknown> {
  return { items: [], restaurantId: params?.restaurantId ?? '' };
}

export async function addToCart(params: Record<string, unknown>): Promise<unknown> {
  return { cartId: 'stub', items: params?.items ?? [] };
}

export async function placeOrder(_params: Record<string, unknown>): Promise<{ orderId: string }> {
  return { orderId: `order-${Date.now()}` };
}
