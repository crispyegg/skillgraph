import { useEffect, useState } from 'react';
import { getCandidates } from '../api/client';
import CandidateCard from '../components/CandidateCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  async function loadCandidates() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const candidatesFromApi = await getCandidates();
      setCandidates(candidatesFromApi);
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCandidates();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Candidates</h1>
      <p className="text-slate-500 mb-6">
        Browse candidates and see job recommendations for each.
      </p>

      {isLoading && <LoadingState label="Loading candidates..." />}

      {!isLoading && errorMessage && (
        <ErrorState message={errorMessage} onRetry={loadCandidates} />
      )}

      {!isLoading && !errorMessage && candidates && candidates.length === 0 && (
        <EmptyState
          title="No candidates yet"
          subtitle="Run the seed script to load sample data."
        />
      )}

      {!isLoading && !errorMessage && candidates && candidates.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </div>
  );
}
