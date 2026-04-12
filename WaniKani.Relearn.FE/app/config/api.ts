/**
 * API Configuration
 * Uses environment variables with fallback to localhost for development
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5138';

export const API_ENDPOINTS = {
  subjects: (type: string) => `${API_BASE_URL}/api/subjects/${type}`,
  subjectById: (id: string | number) => `${API_BASE_URL}/api/subjects/${id}`,
  assignments: `${API_BASE_URL}/assignments`,
} as const;
