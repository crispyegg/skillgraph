import { useEffect, useState } from 'react';
import { getJobs } from '../api/client';
import JobCard from '../components/JobCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function JobsPage() {
  // Three pieces of state describe everything this page can show:
  // - jobs: the list of jobs once loaded (starts as null = "not loaded yet")
  // - isLoading: true while we're waiting for the API
  // - errorMessage: set if the API call fails
  const [jobs, setJobs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  async function loadJobs() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const jobsFromApi = await getJobs();
      setJobs(jobsFromApi);
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  // Run loadJobs() once, right when this page first appears on screen.
  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Open Jobs</h1>
      <p className="text-slate-500 mb-6">
        Explore roles and see who matches, including through the skill graph.
      </p>

      {/* Show exactly one of these four states at a time */}

      {isLoading && <LoadingState label="Loading jobs..." />}

      {!isLoading && errorMessage && (
        <ErrorState message={errorMessage} onRetry={loadJobs} />
      )}

      {!isLoading && !errorMessage && jobs && jobs.length === 0 && (
        <EmptyState
          title="No jobs posted yet"
          subtitle="Run the seed script to load sample data."
        />
      )}

      {!isLoading && !errorMessage && jobs && jobs.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
