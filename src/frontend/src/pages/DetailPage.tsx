import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CanvasPanel from '../components/CanvasPanel';
import CodePanel from '../components/CodePanel';
import NavBar from '../components/NavBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSandbox } from '../hooks/useSandbox';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { getCaseById, loadTemplateCode } from '../data/cases';
import { getSandboxBlobUrl } from '../utils/sandbox';
import { getWebGLSandboxBlobUrl } from '../utils/sandbox-webgl';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 767px)');

  const [code, setCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const caseMeta = id ? getCaseById(id) : undefined;

  // Choose sandbox based on case type
  const isWebGL = caseMeta?.sandboxType === 'webgl' || caseMeta?.level === 'webgl';
  const sandboxUrl = isWebGL ? getWebGLSandboxBlobUrl() : getSandboxBlobUrl();

  const {
    runCode, isRunning, error: sandboxError, clearError,
    registerIframe, sandboxReady,
  } = useSandbox({ sandboxUrl, timeout: 60000 });

  const autoRunDoneRef = useRef(false);

  useEffect(() => {
    if (!caseMeta) {
      setLoadError('案例不存在');
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const templateCode = await loadTemplateCode(caseMeta!.templateFile);
        if (!cancelled) {
          setCode(templateCode);
          setOriginalCode(templateCode);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLoadError('加载案例模板失败');
          setIsLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id, caseMeta]);

  useEffect(() => {
    if (!isLoading && sandboxReady && !autoRunDoneRef.current && originalCode) {
      autoRunDoneRef.current = true;
      setTimeout(() => runCode(originalCode), 500);
    }
  }, [isLoading, sandboxReady, originalCode, runCode]);

  const handleRun = useCallback(() => {
    clearError();
    runCode(code);
  }, [code, runCode, clearError]);

  const handleReset = useCallback(() => {
    setCode(originalCode);
    setTimeout(() => runCode(originalCode), 100);
  }, [originalCode, runCode]);

  const hasChanges = code !== originalCode;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-root">
        <NavBar />
        <div className="flex items-center justify-center h-[calc(100vh-56px)]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (loadError || !caseMeta) {
    return (
      <div className="min-h-screen bg-surface-root">
        <NavBar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-56px)] gap-4">
          <p className="text-text-secondary text-lg">{loadError || '案例不存在'}</p>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-hover transition-colors">返回首页</button>
        </div>
      </div>
    );
  }

  const levelLabel = caseMeta.level === 'beginner' ? '初级' : caseMeta.level === 'advanced' ? '高级' : 'WebGL';
  const levelClass = caseMeta.level === 'beginner'
    ? 'bg-accent-success/20 text-accent-success'
    : caseMeta.level === 'advanced'
    ? 'bg-accent-warning/20 text-accent-warning'
    : 'bg-purple-500/20 text-purple-400';

  return (
    <div className="min-h-screen bg-surface-root flex flex-col">
      <NavBar />
      <div className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-border bg-surface-page">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        <span className="text-text-tertiary">/</span>
        <h1 className="text-sm font-medium text-text-primary">{caseMeta.title}</h1>
        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${levelClass}`}>{levelLabel}</span>
      </div>

      {isMobile ? (
        <div className="flex-1 flex flex-col gap-2 p-2 min-h-0">
          <div className="h-[40vh]">
            <CanvasPanel sandboxUrl={sandboxUrl} registerIframe={registerIframe} isRunning={isRunning} error={sandboxError} sandboxReady={sandboxReady} />
          </div>
          <div className="flex-1 min-h-[40vh]">
            <CodePanel code={code} onChange={setCode} onRun={handleRun} onReset={handleReset} isRunning={isRunning} hasChanges={hasChanges} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex min-h-0">
          <div className="w-[45%] xl:w-[48%] p-2">
            <CanvasPanel sandboxUrl={sandboxUrl} registerIframe={registerIframe} isRunning={isRunning} error={sandboxError} sandboxReady={sandboxReady} />
          </div>
          <div className="flex-1 p-2 pl-0 min-w-0">
            <CodePanel code={code} onChange={setCode} onRun={handleRun} onReset={handleReset} isRunning={isRunning} hasChanges={hasChanges} />
          </div>
        </div>
      )}
    </div>
  );
}