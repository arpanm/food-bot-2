/**
 * Temporal worker - runs workflows and activities.
 * Build: npm run build. Run: node dist/src/worker.js
 */
import { Worker, NativeConnection } from '@temporalio/worker';
import path from 'path';
import * as orderActivities from '../activities/order.activities';
import * as partyPlannerActivities from '../activities/party-planner.activities';
import * as dietPlannerActivities from '../activities/diet-planner.activities';
import * as mcpExecutionActivities from '../activities/mcp-execution.activities';

async function run() {
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
  });
  const worker = await Worker.create({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'food-bot-workflows',
    workflowsPath: path.resolve(__dirname, '../workflows'),
    activities: {
      ...orderActivities,
      ...partyPlannerActivities,
      ...dietPlannerActivities,
      ...mcpExecutionActivities,
    },
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
