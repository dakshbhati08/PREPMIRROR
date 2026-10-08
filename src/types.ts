export type TargetRole =
  | 'Web Developer'
  | 'Data Analyst'
  | 'Software Engineer'
  | 'Customer Support'
  | 'Marketing'
  | 'Other';

export type ExperienceLevel = 'Fresher' | '0-1 yr' | '1-3 yrs';

export type LanguagePreference = 'English' | 'Hinglish';

export interface UserProfile {
  profileId: string;
  resumeName: string;
  links: string[];
  targetRole: TargetRole;
  experienceLevel: ExperienceLevel;
  language: LanguagePreference;
}

export interface InterviewQuestion {
  index: number;
  total: number;
  category: string;
  prompt: string;
  friendlyLine: string;
}

export interface AnswerFeedback {
  transcript: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface SkillScore {
  skill: string;
  score: number;
  fullMark: number;
}

export interface ReportData {
  sessionId: string;
  date: string;
  targetRole: TargetRole;
  overallScore: number;
  summary: string;
  skills: SkillScore[];
  strengths: { title: string; quote: string }[];
  needsWork: { title: string; quote: string }[];
  communication: {
    speakingPace: string;
    fillerWordCount: number;
    answerStructureRating: string;
    notes: string;
  };
  roadmap: {
    period: string;
    topics: { name: string; resource: string; resourceUrl: string }[];
  }[];
  resumeTips: string[];
  transcriptReplay: {
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }[];
}

export interface SessionSummary {
  sessionId: string;
  date: string;
  targetRole: TargetRole;
  score: number;
  duration: string;
}
