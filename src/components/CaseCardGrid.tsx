import { CaseMeta } from '../types';
import CaseCard from './CaseCard';
import EmptyState from './EmptyState';

interface CaseCardGridProps {
  cases: CaseMeta[];
}

export default function CaseCardGrid({ cases }: CaseCardGridProps) {
  if (cases.length === 0) {
    return <EmptyState message="未找到相关案例" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 animate-fade-in">
      {cases.map((caseData) => (
        <CaseCard key={caseData.id} caseData={caseData} />
      ))}
    </div>
  );
}