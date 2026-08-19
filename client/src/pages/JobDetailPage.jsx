import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJob, getJobMatches } from '../api/client';
import SkillBadge from '../components/SkillBadge';
import MatchResults from '../components/MatchResults';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function JobDetailPage() {
  // useParams() reads the ":id" part out of the current URL,
  // e.g. visiting /jobs/j_frontend_nimbus gives us id = "j_frontend_nimbus"
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [matches, setMatches] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  async function loadJobAndMatches() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // Two separate API calls, one after another. We could run them at
      // the same time for speed, but doing them one by one is easier to
      // follow: first get the job's own details, then get its matches.
      const jobData = await getJob(id);
      setJob(jobData);

      const matchData = await getJobMatches(id);
      setMatches(matchData);
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  // Re-run whenever the id in the URL changes (e.g. navigating from one
  // job's page straight to another job's page).
  useEffect(() => {
    loadJobAndMatches();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingState label="Loading job..." />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorState message={errorMessage} onRetry={loadJobAndMatches} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/jobs" className="text-sm text-indigo-600 hover:underline mb-4 inline-block">
        ← Back to jobs
      </Link>

      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
        <p className="text-slate-500">
          {job.company.name} · {job.company.industry}
        </p>
        <p className="text-slate-600 mt-3">{job.description}</p>
        <p className="text-sm text-slate-400 mt-2">
          Minimum experience: {job.minExperience} years
        </p>

        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Required skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills.map((skill) => (
              <SkillBadge key={skill.id} name={skill.name} category={skill.category} />
            ))}
          </div>
        </div>
      </div>

      <MatchResults matches={matches} />
    </div>
  );
}
