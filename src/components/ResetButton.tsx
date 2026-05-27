import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

interface ResetButtonProps {
  onReset: () => void;
  disabled?: boolean;
}

export default function ResetButton({ onReset, disabled = false }: ResetButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  function handleClick() {
    setShowConfirm(true);
  }

  function handleConfirm() {
    setShowConfirm(false);
    onReset();
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover hover:border-text-tertiary transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
        title="重置为模板代码"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        重置
      </button>

      {showConfirm && (
        <ConfirmDialog
          title="重置代码"
          message="确定要重置代码吗？您的修改将丢失。"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}