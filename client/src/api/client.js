import axios from 'axios';

// The base URL of our backend API.
// In development this comes from client/.env (VITE_API_URL).
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // give up after 10 seconds
});

// -----------------------------------------------------------------------
// Each function below does ONE thing: call one backend endpoint and
// return just the data (not the whole axios response object).
// Pages import these functions instead of calling axios directly.
// -----------------------------------------------------------------------

export async function getJobs() {
  const response = await api.get('/jobs');
  return response.data;
}

export async function getJob(jobId) {
  const response = await api.get('/jobs/' + jobId);
  return response.data;
}

export async function getJobMatches(jobId) {
  const response = await api.get('/jobs/' + jobId + '/matches');
  return response.data;
}

export async function getCandidates() {
  const response = await api.get('/candidates');
  return response.data;
}

export async function getCandidate(candidateId) {
  const response = await api.get('/candidates/' + candidateId);
  return response.data;
}


export async function getJobsForCandidate(candidateId) {
  const response = await api.get('/matches/candidates/' + candidateId + '/jobs');
  return response.data;
}
