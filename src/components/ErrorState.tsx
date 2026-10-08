import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ message, onRetry, className = '' }: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 text-center ${className}`}>
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <AlertCircle className="w-7 h-7 text-red-500" />
      </div>
      <p className="text-sm text-ink-600 max-w-sm">
        {message || 'Something went wrong. Please try again.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary !px-5 !py-2 text-sm mt-1">
          Try again
        </button>
      )}
    </div>
  );
}
