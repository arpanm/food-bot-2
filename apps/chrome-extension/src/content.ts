/**
 * Food Bot - Content script: listens for jobId from chat page and forwards to background
 */
(function () {
  window.addEventListener('message', (event: MessageEvent) => {
    if (event.source !== window) return;
    const data = event.data as { type?: string; jobId?: string };
    if (data?.type === 'foodbot-job-created' && typeof data.jobId === 'string') {
      chrome.runtime.sendMessage({ type: 'RUN_JOB', jobId: data.jobId }).catch(() => {
        // Extension context may be invalid; ignore
      });
    }
  });
})();
