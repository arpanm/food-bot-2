import { useState, useCallback } from 'react';
import { submitPrompt, getJobStatus } from '../api';
import RichMessage from '../components/RichMessage';

type Message = { role: 'user' | 'assistant'; content: string };

const POLL_INTERVAL_MS = 800;
const MAX_POLL_ATTEMPTS = 30;

export default function DietPlanner() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollJob = useCallback(async (jobId: string) => {
    for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
      const data = await getJobStatus(jobId);
      if (data.status === 'completed' && data.messages?.length) {
        setMessages((prev) => [
          ...prev,
          ...data.messages!.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
        ]);
        return;
      }
      if (data.status === 'failed') {
        setError('Request failed.');
        return;
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }
    setError('Request timed out.');
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const { jobId } = await submitPrompt(text);
      await pollJob(jobId);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-slate-800">Diet planner</h2>
        <p className="text-slate-600 text-sm mt-1">
          Weekly meal calendar, health goals, or ask for balanced meal suggestions.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 p-2 border border-slate-200 rounded-lg bg-slate-50/50 min-h-[200px]">
        {messages.length === 0 && (
          <p className="text-slate-500 text-sm">
            Try: &quot;Give me a 7-day vegetarian meal plan&quot; or &quot;Low-carb lunch ideas for
            office&quot;
          </p>
        )}
        {messages.map((m, i) => (
          <div key={`${m.role}-${i}-${String(m.content).slice(0, 24)}`}>
            <RichMessage content={m.content} role={m.role} />
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-500 text-sm">
              Thinking…
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-red-600 text-sm mb-2 mt-2">{error}</p>}
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          aria-label="Diet planning message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="e.g. Weekly meal plan for weight loss"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          disabled={loading}
        />
        <button
          type="button"
          onClick={send}
          disabled={loading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
