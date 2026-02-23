export interface CTAButtonProps {
  label: string;
  primary?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function CTAButton({ label, primary = true, onClick, disabled }: CTAButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        primary
          ? 'rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50'
          : 'rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50'
      }
    >
      {label}
    </button>
  );
}
