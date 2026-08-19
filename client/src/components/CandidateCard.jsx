import { Link } from 'react-router-dom';
import SkillBadge from './SkillBadge';

export default function CandidateCard({ candidate }) {
  return (
    <Link
      to={`/candidates/${candidate.id}`}
      className="block bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{candidate.name}</h3>
          <p className="text-sm text-slate-500">{candidate.experienceYears} yrs experience</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {candidate.skills?.slice(0, 5).map((s) => (
          <SkillBadge key={s} name={s} />
        ))}
      </div>
    </Link>
  );
}
