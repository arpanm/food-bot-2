import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/diet-planner.activities';

const { generateWeeklyPlan, scheduleMealOrders } = proxyActivities<typeof activities>({
  startToCloseTimeout: '60s',
  retry: { maximumAttempts: 3 },
});

export interface DietPlannerWorkflowInput {
  jobId: string;
  userId: string;
  healthGoals?: string;
  preferences?: string[];
  addressesByMeal?: Record<string, string>;
  startDate: string;
}

export async function dietPlannerWorkflow(
  input: DietPlannerWorkflowInput
): Promise<{ success: boolean }> {
  const plan = await generateWeeklyPlan({
    userId: input.userId,
    healthGoals: input.healthGoals,
    preferences: input.preferences,
    startDate: input.startDate,
  });
  await scheduleMealOrders({
    userId: input.userId,
    plan,
    addressesByMeal: input.addressesByMeal,
  });
  return { success: true };
}
