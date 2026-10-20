interface FeaturedToggleProps {
  isFeatured: boolean;
  isLoading?: boolean;
  onToggle: () => void;
}

// Estrella para marcar/desmarcar un elemento como destacado (isFeatured)
export default function FeaturedToggle({ isFeatured, isLoading = false, onToggle }: FeaturedToggleProps) {
  const label = isFeatured ? 'Quitar destacado' : 'Marcar como destacado';

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isLoading}
      aria-pressed={isFeatured}
      aria-label={label}
      title={label}
      className={`flex size-8 shrink-0 items-center justify-center rounded-md transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 ${
        isFeatured
          ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
          : 'text-slate-500 hover:bg-slate-700/60 hover:text-slate-200'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={isFeatured ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        className={`size-4 ${isLoading ? 'animate-pulse' : ''}`}
        aria-hidden="true"
      >
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z" />
      </svg>
    </button>
  );
}
