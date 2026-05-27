import { useCallback, useRef, useEffect, useState } from 'react';
import type { SandboxError } from '../types';

interface UseSandboxOptions {
  sandboxUrl: string;
  timeout?: number;
}

interface UseSandboxReturn {
  runCode: (code: string) => void;
  isRunning: boolean;
  error: SandboxError | null;
  clearError: () => void;
  sandboxReady: boolean;
  registerIframe: (el: HTMLIFrameElement | null) => void;
}

export function useSandbox({ sandboxUrl, timeout = 60000 }: UseSandboxOptions): UseSandboxReturn {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<SandboxError | null>(null);
  const [sandboxReady, setSandboxReady] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const { data } = event;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'ready') {
        setSandboxReady(true);
        return;
      }

      if (data.type === 'result') {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setIsRunning(false);
        if (data.success) {
          setError(null);
        } else {
          setError(data.error || { type: 'Error', message: '未知错误' });
        }
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (iframeRef.current) {
      const timer = setTimeout(() => {
        if (!sandboxReady) setSandboxReady(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sandboxReady]);

  const runCode = useCallback(
    (code: string) => {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) return;

      setError(null);
      setIsRunning(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsRunning(false);
        setError({ type: 'TimeoutError', message: '代码执行超时（超过 60 秒），已自动终止' });
      }, timeout);

      iframe.contentWindow.postMessage({ type: 'run', code }, '*');
    },
    [timeout]
  );

  const clearError = useCallback(() => setError(null), []);

  const registerIframe = useCallback((el: HTMLIFrameElement | null) => {
    iframeRef.current = el;
    if (el) {
      setTimeout(() => {
        if (!sandboxReady) setSandboxReady(true);
      }, 2000);
    }
  }, [sandboxReady]);

  return { runCode, isRunning, error, clearError, sandboxReady, registerIframe };
}