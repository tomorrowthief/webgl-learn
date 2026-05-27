import LoadingSpinner from './LoadingSpinner';

interface RunButtonProps {
  onRun: () => void;
  isRunning: boolean;
}

export default function RunButton({ onRun, isRunning }: RunButtonProps) {
  return (
    <button
      onClick={onRun}
      disabled={isRunning}
      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
        isRunning
          ? 'bg-accent-primary/30 text-text-tertiary cursor-not-allowed'
          : 'bg-accent-primary text-white hover:bg-accent-primary-hover shadow-glow hover:shadow-glow-lg active:scale-95'
      }`}
    >
      {isRunning ? (
        <>
          <LoadingSpinner size="sm" />
          运行中
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
          运行
        </>
      )}
    </button>
  );
}