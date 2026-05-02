/**
 * API Configuration
 * Uses environment variables with fallback to localhost for development
 */
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5138';
export const API_BASE_URL = rawApiUrl.startsWith('http') ? rawApiUrl : `http://${rawApiUrl}`;

export const API_ENDPOINTS = {
  subjects: (type: string) => `${API_BASE_URL}/api/subjects/${type}`,
  subjectById: (id: string | number) => `${API_BASE_URL}/api/subjects/${id}`,
  assignments: `${API_BASE_URL}/assignments`,
  readingSentences: `${API_BASE_URL}/api/reading-practice/sentences`,
} as const;
