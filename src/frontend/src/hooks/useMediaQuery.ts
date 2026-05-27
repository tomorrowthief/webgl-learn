import { useState, useEffect } from 'react';

/**
 * 响应式断点 hook
 * 返回当前是否匹配指定媒体查询
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** 是否桌面端 (≥1024px) */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

/** 是否平板端 (768px-1023px) */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

/** 是否手机端 (<768px) */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}