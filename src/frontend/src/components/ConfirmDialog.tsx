import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCancel();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div className="relative bg-surface-card border border-border rounded-xl shadow-xl max-w-sm w-full mx-4 p-6 animate-slide-up">
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-6">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-surface-hover transition-colors duration-150"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium bg-accent-error text-white rounded-lg hover:bg-red-600 transition-colors duration-150"
          >
            确认重置
          </button>
        </div>
      </div>
    </div>
  );
}