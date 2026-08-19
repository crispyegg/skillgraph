import { Link } from 'react-router-dom';
import EmptyState from './EmptyState';

export default function MatchResults({ matches }) {
  const { direct = [], viaColleague = [] } = matches;

  return (
    <div className="space-y-8">
      <section>
        <h3 className="font-semibold text-slate-900 mb-1">Direct & related-skill matches</h3>
        <p className="text-xs text-slate-400 mb-3">
          Ranked by skill overlap, including skills within 2 hops on the skill graph.
        </p>
        {direct.length === 0 ? (
          <EmptyState title="No matches yet" subtitle="No candidates match this job's required skills." />
        ) : (
          <div className="space-y-2">
            {direct.map((m) => (
              <Link
                key={m.id}
                to={`/candidates/${m.id}`}
                className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-indigo-300 transition-colors"
              >
                <div>
                  <p className="font-medium text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-400">
                    Matched on: {m.matchedOnSkills?.join(', ') || '—'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-indigo-600">{m.matchScore?.toFixed(1)}</span>
                  <p className="text-xs text-slate-400">score</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-semibold text-slate-900 mb-1">Reachable through a colleague</h3>
        <p className="text-xs text-slate-400 mb-3">
          These candidates don't have a required skill directly, but worked on a shared project with someone who does.
        </p>
        {viaColleague.length === 0 ? (
          <EmptyState title="No colleague-network matches" subtitle="No indirect candidates found for this job." />
        ) : (
          <div className="space-y-2">
            {viaColleague.map((m, i) => (
              <Link
                key={`${m.id}-${i}`}
                to={`/candidates/${m.id}`}
                className="flex items-center justify-between bg-amber-50/50 border border-amber-200 rounded-lg px-4 py-3 hover:border-amber-300 transition-colors"
              >
                <div>
                  <p className="font-medium text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-500">
                    via <span className="font-medium">{m.viaColleague}</span> on "{m.sharedProject}" — missing {m.missingSkill}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
