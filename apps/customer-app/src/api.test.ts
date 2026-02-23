import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { submitPrompt, getJobStatus } from './api';

describe('api', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('submitPrompt calls POST /chat/prompt with prompt body', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ jobId: 'job-1' }),
      text: () => Promise.resolve(''),
    } as Response);

    const result = await submitPrompt('Find biryani');
    expect(result).toEqual({ jobId: 'job-1' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/chat/prompt'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Find biryani' }),
      })
    );
  });

  it('getJobStatus calls GET /jobs/:id/status', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ status: 'completed', messages: [] }),
      text: () => Promise.resolve(''),
    } as Response);

    await getJobStatus('job-abc');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/jobs/job-abc/status'),
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it('submitPrompt throws when response not ok', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve('Server error'),
    } as Response);

    await expect(submitPrompt('x')).rejects.toThrow('Server error');
  });
});
