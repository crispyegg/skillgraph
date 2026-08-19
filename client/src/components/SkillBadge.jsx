const CATEGORY_COLORS = {
  Frontend: 'bg-blue-50 text-blue-700 border-blue-200',
  Backend: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Data: 'bg-purple-50 text-purple-700 border-purple-200',
  DevOps: 'bg-orange-50 text-orange-700 border-orange-200',
  'Data Science': 'bg-pink-50 text-pink-700 border-pink-200',
  Mobile: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

export default function SkillBadge({ name, category }) {
  const colorClass = CATEGORY_COLORS[category] || 'bg-slate-50 text-slate-600 border-slate-200';
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
      {name}
    </span>
  );
}
