import { useNavigate } from 'react-router-dom';
import { CaseMeta } from '../types';

interface CaseCardProps {
  caseData: CaseMeta;
}

const LEVEL_CONFIG = {
  beginner: {
    label: '初级',
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    border: 'border-green-500/20',
  },
  advanced: {
    label: '高级',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/20',
  },
  webgl: {
    label: 'WebGL',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
  },
};

export default function CaseCard({ caseData }: CaseCardProps) {
  const navigate = useNavigate();
  const levelCfg = LEVEL_CONFIG[caseData.level];

  return (
    <article
      onClick={() => navigate(`/detail/${caseData.id}`)}
      className="group cursor-pointer bg-surface-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-primary/10 hover:border-accent-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page"
      tabIndex={0}
      role="button"
      aria-label={`查看案例: ${caseData.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(`/detail/${caseData.id}`);
      }}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-surface-canvas relative overflow-hidden">
        <img
          src={caseData.thumbnail}
          alt={caseData.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-text-primary truncate group-hover:text-accent-primary-hover transition-colors duration-150">
            {caseData.title}
          </h3>
          <span
            className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${levelCfg.bg} ${levelCfg.text} ${levelCfg.border}`}
          >
            {levelCfg.label}
          </span>
        </div>
        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
          {caseData.description}
        </p>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {caseData.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-accent-primary/10 text-accent-primary-hover"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}