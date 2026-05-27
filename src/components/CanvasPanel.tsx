import { useRef } from 'react';
import { SandboxError } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

interface CanvasPanelProps {
  sandboxUrl: string;
  registerIframe: (el: HTMLIFrameElement | null) => void;
  isRunning: boolean;
  error: SandboxError | null;
  sandboxReady: boolean;
}

export default function CanvasPanel({
  sandboxUrl,
  registerIframe,
  isRunning,
  error,
  sandboxReady,
}: CanvasPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[300px] bg-surface-canvas rounded-xl border border-border overflow-hidden"
    >
      <iframe
        ref={registerIframe}
        src={sandboxUrl}
        className="absolute inset-0 w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin"
        title="渲染沙箱"
      />

      {isRunning && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-canvas/80 backdrop-blur-sm z-10">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <ErrorDisplay error={error} />
        </div>
      )}

      {!sandboxReady && !isRunning && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <p className="text-text-tertiary text-sm">点击右侧「运行」查看效果</p>
        </div>
      )}
    </div>
  );
}