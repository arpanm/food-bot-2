export interface MessageCardProps {
  image?: string;
  title: string;
  body?: string;
  attributes?: Array<{ label: string; value: string }>;
}

export default function MessageCard({ image, title, body, attributes }: MessageCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm max-w-sm">
      {image && <img src={image} alt="" className="w-full h-32 object-cover" />}
      <div className="p-3">
        <h3 className="font-medium text-slate-800">{title}</h3>
        {body && <p className="text-sm text-slate-600 mt-1">{body}</p>}
        {attributes && attributes.length > 0 && (
          <dl className="mt-2 space-y-1 text-sm">
            {attributes.map(({ label, value }) => (
              <div key={label} className="flex justify-between text-slate-600">
                <dt>{label}</dt>
                <dd className="font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
