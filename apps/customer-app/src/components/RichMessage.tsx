import MessageCard from './MessageCard';
import CTAButton from './CTAButton';

export type RichContent =
  | { type: 'text'; text: string }
  | {
      type: 'card';
      image?: string;
      title: string;
      body?: string;
      attributes?: Array<{ label: string; value: string }>;
    }
  | { type: 'cta'; label: string; action?: string };

export interface RichMessageProps {
  content: string | RichContent | RichContent[];
  role: 'user' | 'assistant';
}

function parseContent(raw: string): RichContent[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as RichContent | RichContent[];
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [{ type: 'text', text: raw }];
    }
  }
  return [{ type: 'text', text: raw }];
}

export default function RichMessage({ content, role }: RichMessageProps) {
  const items =
    typeof content === 'string'
      ? parseContent(content)
      : Array.isArray(content)
        ? content
        : [content];
  const isUser = role === 'user';

  return (
    <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
      {items.map((item, i) => {
        if (item.type === 'text') {
          return (
            <div
              key={i}
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                isUser
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-800'
              }`}
            >
              {item.text}
            </div>
          );
        }
        if (item.type === 'card') {
          return (
            <MessageCard
              key={i}
              image={item.image}
              title={item.title}
              body={item.body}
              attributes={item.attributes}
            />
          );
        }
        if (item.type === 'cta') {
          return <CTAButton key={i} label={item.label} onClick={() => {}} />;
        }
        return null;
      })}
    </div>
  );
}
