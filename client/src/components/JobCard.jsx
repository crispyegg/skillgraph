import { Link } from 'react-router-dom';
import SkillBadge from './SkillBadge';

export default function JobCard({ job }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="block bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{job.title}</h3>
          <p className="text-sm text-slate-500">{job.company}</p>
        </div>
        <span className="text-xs text-slate-400">{job.minExperience}+ yrs</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.requiredSkills?.slice(0, 5).map((s) => (
          <SkillBadge key={s} name={s} />
        ))}
      </div>
    </Link>
  );
}
