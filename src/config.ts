export const API_BASE_URL = 'https://api.prepmirror.example.com';

export const API_ENDPOINTS = {
  PROFILE: '/profile',
  ANSWER: '/answer',
  FINISH: '/finish',
  REPORT: (sessionId: string) => `/report/${sessionId}`,
  SESSIONS: '/sessions',
} as const;
