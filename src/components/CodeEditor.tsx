import { useRef, useCallback } from 'react';
import Editor, { OnMount, BeforeMount } from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
}

export default function CodeEditor({ value, onChange, onRun }: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  const handleBeforeMount: BeforeMount = useCallback((monaco) => {
    monacoRef.current = monaco;
  }, []);

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Bind Ctrl+S / Cmd+S to run
    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      ],
      run: () => onRun(),
    });

    editor.focus();
  }, [onRun]);

  function handleChange(val: string | undefined) {
    if (val !== undefined) {
      onChange(val);
    }
  }

  return (
    <Editor
      height="100%"
      language="javascript"
      theme="vs-dark"
      value={value}
      onChange={handleChange}
      beforeMount={handleBeforeMount}
      onMount={handleMount}
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
        lineNumbers: 'on',
        minimap: { enabled: false },
        tabSize: 2,
        automaticLayout: true,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        bracketPairColorization: { enabled: true },
        matchBrackets: 'always',
        autoClosingBrackets: 'always',
        autoIndent: 'full',
        formatOnPaste: true,
        padding: { top: 8, bottom: 8 },
        renderLineHighlight: 'line',
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        folding: true,
        foldingStrategy: 'indentation',
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
        guides: {
          indentation: true,
          bracketPairs: true,
        },
      }}
      loading={
        <div className="flex items-center justify-center h-full text-text-tertiary text-sm">
          加载编辑器中...
        </div>
      }
    />
  );
}