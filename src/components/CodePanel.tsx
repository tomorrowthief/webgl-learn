import { ReactNode } from 'react';
import CodeEditor from './CodeEditor';
import RunButton from './RunButton';
import ResetButton from './ResetButton';

interface CodePanelProps {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  onReset: () => void;
  isRunning: boolean;
  hasChanges: boolean;
}

export default function CodePanel({
  code,
  onChange,
  onRun,
  onReset,
  isRunning,
  hasChanges,
}: CodePanelProps) {
  return (
    <div className="flex flex-col h-full bg-surface-card border border-border rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-toolbar">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            JavaScript
          </span>
          {hasChanges && (
            <span className="w-2 h-2 rounded-full bg-accent-warning" title="代码已修改" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <RunButton onRun={onRun} isRunning={isRunning} />
          <ResetButton onReset={onReset} disabled={isRunning} />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <CodeEditor value={code} onChange={onChange} onRun={onRun} />
      </div>
    </div>
  );
}