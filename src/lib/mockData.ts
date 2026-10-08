import type {
  AnswerFeedback,
  InterviewQuestion,
  ReportData,
  SessionSummary,
  UserProfile,
} from '@/types';

const QUESTIONS: Omit<InterviewQuestion, 'index' | 'total'>[] = [
  {
    category: 'Introduction',
    prompt: 'Tell me a bit about yourself and what got you interested in this role.',
    friendlyLine: "Let's start easy — just introduce yourself in whatever way feels natural.",
  },
  {
    category: 'Technical',
    prompt: 'Can you explain the difference between == and === in JavaScript?',
    friendlyLine: 'Great start! Now a quick technical question — take your time.',
  },
  {
    category: 'Project',
    prompt: "Walk me through a project you're most proud of. What was your role?",
    friendlyLine: 'Nice answer! Let\u2019s talk about your project next.',
  },
  {
    category: 'Problem Solving',
    prompt: 'How would you approach debugging a slow database query?',
    friendlyLine: 'Interesting! Let\u2019s see how you tackle a practical problem.',
  },
  {
    category: 'Behavioural',
    prompt: 'Tell me about a time you disagreed with a teammate. How did you handle it?',
    friendlyLine: 'Good detail. Now a behavioural one — there\u2019s no wrong answer here.',
  },
  {
    category: 'Technical',
    prompt: 'What happens when you type a URL into the browser and press enter?',
    friendlyLine: 'Nice story! Let\u2019s go a bit deeper on the technical side.',
  },
  {
    category: 'Project',
    prompt: 'What was the biggest challenge in your last project and how did you overcome it?',
    friendlyLine: 'Almost there! One more about your hands-on experience.',
  },
  {
    category: 'Closing',
    prompt: 'Where do you see yourself in the next two years, and what are you doing to get there?',
    friendlyLine: 'Last one! Let\u2019s talk about your goals.',
  },
];

export function buildQuestions(total = QUESTIONS.length): InterviewQuestion[] {
  return QUESTIONS.slice(0, total).map((q, i) => ({
    ...q,
    index: i + 1,
    total,
  }));
}

const MOCK_ANSWERS = [
  "So I've been learning web development for about a year now. I started with HTML and CSS and then moved to JavaScript and React. I really enjoy building user interfaces and solving problems. My background is actually in commerce, but I decided to switch because I love the creative side of coding.",
  "So, equality operator == does type coercion which means it, like, converts the types before comparing. And triple equals === checks both value and type without converting. So like, 1 == '1' is true, but 1 === '1' is false. It\u2019s generally better to use triple equals to avoid, you know, unexpected bugs.",
  "I built a movie discovery app using React and the TMDB API. I worked on it solo for about three weeks. The app lets users search for movies, see trending ones, and save favorites. I used React Router for navigation and Tailwind for styling. The hardest part was handling pagination and loading states, but I learned a lot about API integration.",
  "I would first check if there\u2019s an index on the columns being queried. Then I\u2019d look at the query plan to see if there are full table scans. Maybe I\u2019d add indexes or rewrite the query. I\u2019d also check if the dataset is too large and whether we need caching or partitioning.",
  "In my last project, my teammate wanted to use a different state management library. I preferred Redux but they wanted Zustand. We talked it through, looked at the project size, and decided Zustand was actually lighter and sufficient. It taught me to be more open to different approaches.",
  "The browser checks the DNS cache, then asks the DNS server for the IP. Then it opens a TCP connection, does the TLS handshake if it\u2019s HTTPS, sends an HTTP request, the server responds with HTML, the browser parses it, requests CSS and JS, renders the DOM, and executes scripts.",
  "The biggest challenge was handling authentication. I hadn\u2019t done it before. I spent a few days reading about JWT and sessions, then implemented a login flow with context API. It was tricky but I got it working and learned a lot about security.",
  "I see myself as a confident frontend developer working on meaningful products. I\u2019m currently doing small freelance projects and building my portfolio. I also plan to learn TypeScript and Node.js to become more full-stack.",
];

export function mockFeedbackForAnswer(answerIndex: number): AnswerFeedback {
  const transcript = MOCK_ANSWERS[answerIndex] ?? MOCK_ANSWERS[0];
  const fillerCount = (transcript.match(/\b(like|you know|so|um|uh|actually)\b/gi) || []).length;
  const score = Math.round(60 + Math.random() * 35);
  return {
    transcript,
    score,
    feedback:
      score >= 80
        ? 'Strong answer with good detail and structure.'
        : score >= 70
          ? 'Good answer, but could be more structured.'
          : 'Decent attempt — try to add more specific examples.',
    strengths:
      score >= 75
        ? ['Clear explanation', 'Relevant example']
        : ['Attempted the question'],
    improvements:
      score >= 75
        ? ['Could be more concise']
        : ['Add a concrete example', 'Structure your answer better'],
  };
}

export function mockReport(): ReportData {
  return {
    sessionId: 'sess_demo_001',
    date: new Date().toISOString(),
    targetRole: 'Web Developer',
    overallScore: 74,
    summary:
      "You\u2019re on the right track! Your communication is clear and you speak honestly about your projects. With a bit more structure in your answers and deeper technical detail, you\u2019ll be interview-ready in a few weeks. No judgment — just practice.",
    skills: [
      { skill: 'Technical knowledge', score: 68, fullMark: 100 },
      { skill: 'Problem solving', score: 72, fullMark: 100 },
      { skill: 'Communication', score: 82, fullMark: 100 },
      { skill: 'Project depth', score: 65, fullMark: 100 },
      { skill: 'Confidence & clarity', score: 78, fullMark: 100 },
    ],
    strengths: [
      {
        title: 'Honest and relatable communication',
        quote: 'I really enjoy building user interfaces and solving problems.',
      },
      {
        title: 'Good practical project experience',
        quote: 'I built a movie discovery app using React and the TMDB API.',
      },
    ],
    needsWork: [
      {
        title: 'Technical depth in core concepts',
        quote: 'It\u2019s generally better to use triple equals to avoid, you know, unexpected bugs.',
      },
      {
        title: 'Structuring behavioural answers (try STAR)',
        quote: 'We talked it through, looked at the project size, and decided Zustand was actually lighter.',
      },
    ],
    communication: {
      speakingPace: '142 words/min (slightly fast)',
      fillerWordCount: 14,
      answerStructureRating: '3 / 5 — Somewhat structured',
      notes:
        'You tend to use "like" and "you know" as fillers. Try pausing instead. Your answers are clear but would benefit from a brief intro, detail, and conclusion.',
    },
    roadmap: [
      {
        period: 'Week 1–2',
        topics: [
          { name: 'JavaScript == vs === and type coercion', resource: 'MDN — Equality comparisons', resourceUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness' },
          { name: 'How the browser works (DNS, TCP, rendering)', resource: 'web.dev — Critical rendering path', resourceUrl: 'https://web.dev/articles/critical-rendering-path' },
        ],
      },
      {
        period: 'Week 3–4',
        topics: [
          { name: 'STAR method for behavioural answers', resource: 'The Muse — STAR method guide', resourceUrl: 'https://www.themuse.com/advice/star-interview-method' },
          { name: 'Database indexing & query optimization', resource: 'PostgreSQL Docs — Performance tips', resourceUrl: 'https://www.postgresql.org/docs/current/performance-tips.html' },
        ],
      },
    ],
    resumeTips: [
      'Add measurable outcomes to your project descriptions (e.g., "reduced load time by 30%").',
      'Include a "Skills" section listing React, JavaScript, and tools you used.',
      'Add your GitHub link at the top so recruiters can see your code.',
    ],
    transcriptReplay: buildQuestions().map((q, i) => ({
      question: q.prompt,
      answer: MOCK_ANSWERS[i] ?? MOCK_ANSWERS[0],
      score: Math.round(65 + (i % 3) * 8),
      feedback: i % 2 === 0 ? 'Good structure and detail.' : 'Try to be more concise and specific.',
    })),
  };
}

export function mockSessions(): SessionSummary[] {
  return [
    { sessionId: 'sess_004', date: '2026-10-08', targetRole: 'Web Developer', score: 74, duration: '12 min' },
    { sessionId: 'sess_003', date: '2026-09-28', targetRole: 'Web Developer', score: 62, duration: '10 min' },
    { sessionId: 'sess_002', date: '2026-09-15', targetRole: 'Data Analyst', score: 55, duration: '8 min' },
    { sessionId: 'sess_001', date: '2026-09-01', targetRole: 'Web Developer', score: 48, duration: '6 min' },
  ];
}

export function mockProfile(): UserProfile {
  return {
    profileId: 'prof_demo_001',
    resumeName: '',
    links: [],
    targetRole: 'Web Developer',
    experienceLevel: 'Fresher',
    language: 'English',
  };
}
