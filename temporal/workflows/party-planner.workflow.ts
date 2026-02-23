import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/party-planner.activities';

const { planPartyMenu, createMultiOrder, scheduleOrders } = proxyActivities<typeof activities>({
  startToCloseTimeout: '60s',
  retry: { maximumAttempts: 3 },
});

export interface PartyPlannerWorkflowInput {
  jobId: string;
  userId: string;
  budget?: number;
  headcount: number;
  vegCount: number;
  nonVegCount: number;
  preferredRestaurants?: string[];
  scheduledDate: string;
}

export async function partyPlannerWorkflow(
  input: PartyPlannerWorkflowInput
): Promise<{ success: boolean; orderIds?: string[] }> {
  const plan = await planPartyMenu({
    budget: input.budget,
    headcount: input.headcount,
    vegCount: input.vegCount,
    nonVegCount: input.nonVegCount,
    preferredRestaurants: input.preferredRestaurants,
  });
  const orders = await createMultiOrder({
    userId: input.userId,
    plan,
    scheduledDate: input.scheduledDate,
  });
  await scheduleOrders({ orderIds: orders.orderIds, scheduledDate: input.scheduledDate });
  return { success: true, orderIds: orders.orderIds };
}
