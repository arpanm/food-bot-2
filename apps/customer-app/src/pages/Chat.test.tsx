import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from './Chat';
import { submitPrompt as mockSubmitPromptFn, getJobStatus as mockGetJobStatusFn } from '../api';

vi.mock('../api', () => ({
  submitPrompt: vi.fn(),
  getJobStatus: vi.fn(),
}));

const mockSubmitPrompt = vi.mocked(mockSubmitPromptFn);
const mockGetJobStatus = vi.mocked(mockGetJobStatusFn);

describe('Chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Chat tab shows input and Send button', () => {
    render(<Chat />);
    expect(screen.getByPlaceholderText(/find biryani/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('sending a message adds user message to list', async () => {
    mockSubmitPrompt.mockResolvedValue({ jobId: 'job-1' });
    mockGetJobStatus.mockResolvedValueOnce({ status: 'pending' }).mockResolvedValueOnce({
      status: 'completed',
      messages: [{ role: 'assistant', content: 'Done.' }],
    });

    render(<Chat />);
    const input = screen.getByPlaceholderText(/find biryani/i);
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByText('hello')).toBeInTheDocument();
    await waitFor(() => {
      expect(mockSubmitPrompt).toHaveBeenCalledWith('hello');
    });
  });

  it('submitPrompt calls POST /chat/prompt with prompt body', async () => {
    mockSubmitPrompt.mockResolvedValue({ jobId: 'job-123' });
    mockGetJobStatus.mockResolvedValue({ status: 'completed', messages: [] });

    render(<Chat />);
    fireEvent.change(screen.getByPlaceholderText(/find biryani/i), {
      target: { value: 'biryani' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(mockSubmitPrompt).toHaveBeenCalledWith('biryani');
    });
  });

  it('getJobStatus is called with jobId from submitPrompt', async () => {
    mockSubmitPrompt.mockResolvedValue({ jobId: 'job-456' });
    mockGetJobStatus.mockResolvedValue({
      status: 'completed',
      messages: [{ role: 'assistant', content: 'Here you go.' }],
    });

    render(<Chat />);
    fireEvent.change(screen.getByPlaceholderText(/find biryani/i), { target: { value: 'test' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(mockGetJobStatus).toHaveBeenCalledWith('job-456');
    });
  });

  it('after job completion assistant message appears in chat', async () => {
    mockSubmitPrompt.mockResolvedValue({ jobId: 'job-789' });
    mockGetJobStatus.mockResolvedValue({
      status: 'completed',
      messages: [{ role: 'assistant', content: 'Here are 3 restaurants.' }],
    });

    render(<Chat />);
    fireEvent.change(screen.getByPlaceholderText(/find biryani/i), {
      target: { value: 'find food' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText('Here are 3 restaurants.')).toBeInTheDocument();
    });
  });
});
