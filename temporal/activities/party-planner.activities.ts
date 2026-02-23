export async function planPartyMenu(
  _params: Record<string, unknown>
): Promise<{ items: unknown[]; restaurants: unknown[] }> {
  return { items: [], restaurants: [] };
}

export async function createMultiOrder(
  _params: Record<string, unknown>
): Promise<{ orderIds: string[] }> {
  return { orderIds: [] };
}

export async function scheduleOrders(_params: Record<string, unknown>): Promise<void> {
  return;
}
