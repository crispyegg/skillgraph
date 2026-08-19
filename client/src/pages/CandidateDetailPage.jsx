import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCandidate, getJobsForCandidate } from '../api/client';
import SkillBadge from '../components/SkillBadge';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function CandidateDetailPage() {
  const { id } = useParams();

  const [candidate, setCandidate] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  async function loadCandidateAndJobs() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const candidateData = await getCandidate(id);
      setCandidate(candidateData);

      const jobsData = await getJobsForCandidate(id);
      setRecommendedJobs(jobsData);
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCandidateAndJobs();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingState label="Loading candidate..." />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ErrorState message={errorMessage} onRetry={loadCandidateAndJobs} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/candidates" className="text-sm text-indigo-600 hover:underline mb-4 inline-block">
        ← Back to candidates
      </Link>

      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{candidate.name}</h1>
        <p className="text-slate-500">
          {candidate.email} · {candidate.experienceYears} yrs experience
        </p>
        {candidate.bio && <p className="text-slate-600 mt-3">{candidate.bio}</p>}

        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <SkillBadge key={skill.skill} name={skill.skill} category={skill.category} />
            ))}
          </div>
        </div>

        {candidate.workHistory.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Work history
            </p>
            <ul className="text-sm text-slate-600 space-y-1">
              {candidate.workHistory.map((entry, index) => (
                <li key={index}>
                  {entry.role} at {entry.company} ({entry.from} – {entry.to})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <h2 className="font-semibold text-slate-900 mb-3">Recommended jobs</h2>

      {recommendedJobs.length === 0 && (
        <EmptyState
          title="No job recommendations yet"
          subtitle="This candidate's skills don't overlap with any posted job yet."
        />
      )}

      {recommendedJobs.length > 0 && (
        <div className="space-y-2">
          {recommendedJobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-indigo-300 transition-colors"
            >
              <p className="font-medium text-slate-900">{job.title}</p>
              <div className="text-right">
                <span className="text-sm font-semibold text-indigo-600">{job.matchPercent}%</span>
                <p className="text-xs text-slate-400">
                  {job.overlap}/{job.total} skills
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
