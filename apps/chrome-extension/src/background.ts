/**
 * Food Bot - Chrome extension background script
 * Fetches workflow JSON from gateway and executes steps (reports status + adds chat message)
 */

const GATEWAY_BASE = 'http://localhost:3000/v1';

interface JobStep {
  id: string;
  type: string;
  status: string;
  result?: unknown;
}

interface Job {
  jobId: string;
  prompt: string;
  steps: JobStep[];
  status: string;
}

async function fetchJob(jobId: string): Promise<Job | null> {
  try {
    const res = await fetch(`${GATEWAY_BASE}/jobs/${jobId}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Job fetch ${res.status}`);
    return (await res.json()) as Job;
  } catch (e) {
    console.error('[Food Bot] fetchJob failed', e);
    return null;
  }
}

async function updateStep(
  jobId: string,
  stepId: string,
  body: { status: string; result?: unknown }
): Promise<void> {
  try {
    const res = await fetch(`${GATEWAY_BASE}/jobs/${jobId}/steps/${stepId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) console.warn('[Food Bot] updateStep failed', res.status);
  } catch (e) {
    console.warn('[Food Bot] updateStep error', e);
  }
}

async function addMessage(jobId: string, role: string, content: string): Promise<void> {
  try {
    const res = await fetch(`${GATEWAY_BASE}/jobs/${jobId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, content }),
    });
    if (!res.ok) console.warn('[Food Bot] addMessage failed', res.status);
  } catch (e) {
    console.warn('[Food Bot] addMessage error', e);
  }
}

async function runJob(jobId: string): Promise<void> {
  const job = await fetchJob(jobId);
  if (!job || !job.steps?.length) {
    console.log('[Food Bot] No job or no steps', jobId);
    return;
  }
  console.log('[Food Bot] Executing job', jobId, job.steps.length, 'steps');
  for (const step of job.steps) {
    if (step.status !== 'pending') continue;
    await updateStep(jobId, step.id, { status: 'running' });
    // Execute step client-side: for "search" we just complete with a mock result
    const result =
      step.type === 'search'
        ? {
            message: `You asked: "${job.prompt}". Here are 3 restaurants that match: 1) Biryani House (4.2), 2) Spice Garden (4.0), 3) Tasty Bites (4.5). Say "order from <name>" to place an order.`,
          }
        : { done: true };
    await updateStep(jobId, step.id, {
      status: 'completed',
      result,
    });
    if (typeof result === 'object' && result !== null && 'message' in result) {
      await addMessage(jobId, 'assistant', (result as { message: string }).message);
    }
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Food Bot Workflow Executor installed');
});

chrome.runtime.onMessage.addListener(
  (
    message: { type?: string; jobId?: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (r?: unknown) => void
  ): boolean => {
    if (message.type === 'RUN_JOB' && typeof message.jobId === 'string') {
      runJob(message.jobId).then(() => sendResponse({ ok: true })).catch((e) => {
        console.error('[Food Bot] runJob error', e);
        sendResponse({ ok: false });
      });
      return true; // keep channel open for async sendResponse
    }
    sendResponse(undefined);
    return false;
  }
);
