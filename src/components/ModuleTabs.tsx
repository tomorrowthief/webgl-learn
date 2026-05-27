import { type CaseModule } from '../types';

type ModuleTab = CaseModule | 'all';

interface ModuleTabsProps {
  activeTab: ModuleTab;
  onChange: (tab: ModuleTab) => void;
}

const TABS: { key: ModuleTab; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'basics', label: '基础' },
  { key: 'materials', label: '材质光照' },
  { key: 'interaction', label: '交互动画' },
  { key: 'effects', label: '高级特效' },
  { key: 'webgl', label: 'WebGL' },
];

export default function ModuleTabs({ activeTab, onChange }: ModuleTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-surface-card rounded-lg border border-border">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-3 md:px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 touch-manipulation ${
              isActive
                ? 'bg-accent-primary text-white shadow-glow'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
