import { SandboxError } from '../types';

interface ErrorDisplayProps {
  error: SandboxError;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="p-3 mx-3 mb-3 bg-red-500/10 border border-red-500/30 rounded-lg animate-slide-up">
      <div className="flex items-start gap-2">
        <svg
          className="w-4 h-4 mt-0.5 flex-shrink-0 text-accent-error"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-accent-error uppercase tracking-wider">
              {error.type}
            </span>
            {error.line !== undefined && (
              <span className="text-xs text-text-tertiary">
                第 {error.line} 行
              </span>
            )}
          </div>
          <p className="text-sm text-red-300 mt-0.5 leading-relaxed break-words">
            {error.message}
          </p>
        </div>
      </div>
    </div>
  );
}