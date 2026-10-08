import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({ message, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
      <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      {message && <p className="text-sm text-ink-500 text-center">{message}</p>}
    </div>
  );
}
