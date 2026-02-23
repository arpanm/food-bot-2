import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/order.activities';

const { searchRestaurants, getMenu, addToCart, placeOrder } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30s',
  retry: { maximumAttempts: 3 },
});

export interface OrderWorkflowInput {
  jobId: string;
  userId: string;
  intent: string;
  steps: Array<{ type: string; params: Record<string, unknown> }>;
}

export async function orderWorkflow(
  input: OrderWorkflowInput
): Promise<{ success: boolean; orderId?: string }> {
  for (const step of input.steps) {
    if (step.type === 'search_restaurants') {
      await searchRestaurants(step.params);
    } else if (step.type === 'get_menu') {
      await getMenu(step.params);
    } else if (step.type === 'add_to_cart') {
      await addToCart(step.params);
    } else if (step.type === 'place_order') {
      const result = await placeOrder(step.params);
      return { success: true, orderId: result?.orderId };
    }
  }
  return { success: true };
}
