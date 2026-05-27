import { useState, useMemo } from 'react';
import { CASES, getCasesByModule } from '../data/cases';
import { type CaseModule, MODULE_LABELS } from '../types';
import ModuleTabs from '../components/ModuleTabs';
import SearchBar from '../components/SearchBar';
import CaseCardGrid from '../components/CaseCardGrid';

type ModuleTab = CaseModule | 'all';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ModuleTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = useMemo(() => {
    let cases = getCasesByModule(activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      cases = cases.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return cases;
  }, [activeTab, searchQuery]);

  const moduleOrder: CaseModule[] = ['basics', 'materials', 'interaction', 'effects', 'webgl'];

  const casesByModule = useMemo(() => {
    if (activeTab !== 'all') return null;
    if (searchQuery.trim()) return null;
    const result: Record<string, typeof CASES> = {};
    for (const mod of moduleOrder) {
      result[mod] = CASES.filter((c) => c.module === mod);
    }
    return result;
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-surface-page">
      <section className="pt-20 pb-12 md:pt-24 md:pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            <span className="gradient-hero-text">WebGL / Three.js</span>
            <br />
            <span className="text-text-primary">在线交互式学习</span>
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            无需安装任何工具，打开浏览器即可上手学习 3D 编程。
            边看效果、边改代码、即时运行。
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
            <span className="inline-flex items-center gap-1 text-xs text-text-tertiary">
              <span className="w-2 h-2 rounded-full bg-accent-success" />
              {CASES.length} 个案例
            </span>
            <span className="text-text-tertiary/30">·</span>
            <span className="text-xs text-text-tertiary">5 个知识模块</span>
            <span className="text-text-tertiary/30">·</span>
            <span className="text-xs text-text-tertiary">Monaco Editor</span>
            <span className="text-text-tertiary/30">·</span>
            <span className="text-xs text-text-tertiary">实时渲染</span>
          </div>
        </div>
      </section>

      <section className="px-4 pb-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <ModuleTabs activeTab={activeTab} onChange={setActiveTab} />
          <div className="sm:ml-auto">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Module-grouped view (only when viewing "all" and no search) */}
          {!casesByModule ? null : (
            <div className="space-y-8">
              {moduleOrder.map((mod) => {
                const modCases = casesByModule[mod];
                if (modCases.length === 0) return null;
                return (
                  <div key={mod}>
                    <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 bg-accent-primary rounded-full" />
                      {MODULE_LABELS[mod]}
                      <span className="text-xs text-text-tertiary font-normal">({modCases.length})</span>
                    </h2>
                    <CaseCardGrid cases={modCases} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Flat view (single module selected, or search active) */}
          {casesByModule === null && (
            <>
              {filteredCases.length > 0 && (
                <p className="text-xs text-text-tertiary mb-4">
                  共 {filteredCases.length} 个案例
                  {activeTab !== 'all' && `（${MODULE_LABELS[activeTab] as string}）`}
                  {searchQuery && ` — 搜索 "${searchQuery}"`}
                </p>
              )}
              <CaseCardGrid cases={filteredCases} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
