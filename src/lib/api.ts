import { API_BASE_URL, API_ENDPOINTS } from '@/config';
import type {
  AnswerFeedback,
  InterviewQuestion,
  ReportData,
  SessionSummary,
  TargetRole,
  ExperienceLevel,
  LanguagePreference,
} from '@/types';
import {
  buildQuestions,
  mockFeedbackForAnswer,
  mockReport,
  mockSessions,
} from './mockData';

const USE_MOCK = true;
const MOCK_DELAY = 900;

function delay<T>(value: T, ms = MOCK_DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

interface ProfilePayload {
  resumeFile: File | null;
  resumeName: string;
  links: string[];
  targetRole: TargetRole;
  experienceLevel: ExperienceLevel;
  language: LanguagePreference;
}

interface ProfileResponse {
  profileId: string;
  sessionId: string;
  firstQuestion: InterviewQuestion;
}

export async function submitProfile(payload: ProfilePayload): Promise<ProfileResponse> {
  if (USE_MOCK) {
    const questions = buildQuestions();
    return delay({
      profileId: 'prof_' + Date.now(),
      sessionId: 'sess_' + Date.now(),
      firstQuestion: questions[0],
    });
  }
  const formData = new FormData();
  if (payload.resumeFile) formData.append('resume', payload.resumeFile);
  formData.append('links', JSON.stringify(payload.links));
  formData.append('targetRole', payload.targetRole);
  formData.append('experienceLevel', payload.experienceLevel);
  formData.append('language', payload.language);
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROFILE}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to submit profile');
  return res.json();
}

interface AnswerPayload {
  sessionId: string;
  audioBlob: Blob | null;
  questionIndex: number;
}

interface AnswerResponse {
  transcript: string;
  feedback: AnswerFeedback;
  nextQuestion: InterviewQuestion | null;
}

export async function submitAnswer(payload: AnswerPayload): Promise<AnswerResponse> {
  if (USE_MOCK) {
    const questions = buildQuestions();
    const feedback = mockFeedbackForAnswer(payload.questionIndex);
    const nextIndex = payload.questionIndex + 1;
    const nextQuestion = nextIndex < questions.length ? questions[nextIndex] : null;
    return delay({
      transcript: feedback.transcript,
      feedback,
      nextQuestion,
    });
  }
  const formData = new FormData();
  formData.append('session_id', payload.sessionId);
  if (payload.audioBlob) formData.append('audio', payload.audioBlob);
  formData.append('question_index', String(payload.questionIndex));
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ANSWER}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to submit answer');
  return res.json();
}

export async function finishInterview(sessionId: string): Promise<{ sessionId: string }> {
  if (USE_MOCK) {
    return delay({ sessionId });
  }
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FINISH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId }),
  });
  if (!res.ok) throw new Error('Failed to finish interview');
  return res.json();
}

export async function getReport(sessionId: string): Promise<ReportData> {
  if (USE_MOCK) {
    return delay(mockReport());
  }
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REPORT(sessionId)}`);
  if (!res.ok) throw new Error('Failed to fetch report');
  return res.json();
}

export async function getSessions(): Promise<SessionSummary[]> {
  if (USE_MOCK) {
    return delay(mockSessions(), 600);
  }
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SESSIONS}`);
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}
