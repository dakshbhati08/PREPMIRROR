import { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  ArrowLeft,
  Download,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Quote,
  Gauge,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { getReport } from '@/lib/api';
import type { ReportData } from '@/types';
import { useAsync } from '@/hooks/useAsync';

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#2dd4bf' : score >= 60 ? '#1ba9e0' : '#f59e0b';

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-ink-800">{score}</span>
        <span className="text-xs text-ink-400">/ 100</span>
      </div>
    </div>
  );
}

function ExpandableTranscript({ item, index }: { item: ReportData['transcriptReplay'][0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-ink-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-ink-50 transition-colors text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-sm text-ink-600 truncate">{item.question}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-semibold ${item.score >= 75 ? 'text-teal-600' : 'text-ink-500'}`}>
            {item.score}/100
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-ink-400" /> : <ChevronDown className="w-4 h-4 text-ink-400" />}
        </div>
      </button>
      {open && (
        <div className="px-4 py-4 border-t border-ink-100 bg-ink-50/50 animate-fade-in">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">Question</p>
              <p className="text-sm text-ink-700">{item.question}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">Your answer</p>
              <p className="text-sm text-ink-600 leading-relaxed">{item.answer}</p>
            </div>
            <div className="flex items-start gap-2 bg-teal-50 rounded-lg p-3">
              <Sparkles className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-teal-700">{item.feedback}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ReportPage({ sessionId }: { sessionId: string }) {
  const { navigate } = useRouter();
  const { data: report, loading, error, retry } = useAsync(() => getReport(sessionId), [sessionId]);

  if (loading) return <div className="min-h-screen flex flex-col"><Navbar /><LoadingSpinner message="Analyzing your answers and building your report..." className="flex-1" /><Footer /></div>;
  if (error || !report) return <div className="min-h-screen flex flex-col"><Navbar /><ErrorState message={error ?? 'Could not load your report.'} onRetry={retry} className="flex-1" /><Footer /></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container-max section-padding py-8 sm:py-12">
        <button onClick={() => navigate({ name: 'dashboard' })} className="btn-ghost mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </button>

        {/* Header */}
        <div className="card p-6 sm:p-8 mb-6 bg-gradient-to-br from-white to-brand-50/30">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={report.overallScore} />
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium mb-3">
                <CheckCircle className="w-3.5 h-3.5" />
                Readiness report
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">
                You scored {report.overallScore}/100
              </h1>
              <p className="mt-3 text-ink-600 leading-relaxed">{report.summary}</p>
            </div>
          </div>
        </div>

        {/* Skills radar + communication */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Radar chart */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-ink-800 mb-1">Skill breakdown</h2>
            <p className="text-sm text-ink-400 mb-4">How you did across key interview skills</p>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={report.skills}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: '#475569', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar
                  dataKey="score"
                  stroke="#1ba9e0"
                  fill="#1ba9e0"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Communication analysis */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-semibold text-ink-800">Communication analysis</h2>
            </div>
            <p className="text-sm text-ink-400 mb-4">How you sound, beyond just what you say</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-ink-100">
                <span className="text-sm text-ink-600">Speaking pace</span>
                <span className="text-sm font-medium text-ink-800">{report.communication.speakingPace}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-ink-100">
                <span className="text-sm text-ink-600">Filler words</span>
                <span className="text-sm font-medium text-ink-800">{report.communication.fillerWordCount} detected</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-ink-100">
                <span className="text-sm text-ink-600">Answer structure</span>
                <span className="text-sm font-medium text-ink-800">{report.communication.answerStructureRating}</span>
              </div>
              <div className="bg-brand-50 rounded-xl p-4 mt-3">
                <p className="text-sm text-brand-800 leading-relaxed">{report.communication.notes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths and needs work */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink-800">Your strengths</h2>
            </div>
            <div className="space-y-4">
              {report.strengths.map((s, i) => (
                <div key={i} className="border-l-2 border-teal-400 pl-4">
                  <h3 className="text-sm font-semibold text-ink-700 mb-1">{s.title}</h3>
                  <div className="flex items-start gap-2">
                    <Quote className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-1" />
                    <p className="text-sm text-ink-500 italic leading-relaxed">{s.quote}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-ink-800">Needs work</h2>
            </div>
            <div className="space-y-4">
              {report.needsWork.map((s, i) => (
                <div key={i} className="border-l-2 border-amber-400 pl-4">
                  <h3 className="text-sm font-semibold text-ink-700 mb-1">{s.title}</h3>
                  <div className="flex items-start gap-2">
                    <Quote className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-1" />
                    <p className="text-sm text-ink-500 italic leading-relaxed">{s.quote}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Learning roadmap */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg font-semibold text-ink-800">Your learning roadmap</h2>
          </div>
          <p className="text-sm text-ink-400 mb-5">A prioritized plan to close the gaps — all free resources</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {report.roadmap.map((phase, i) => (
              <div key={i} className="rounded-xl border border-ink-200 p-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-3">
                  {phase.period}
                </div>
                <div className="space-y-3">
                  {phase.topics.map((topic, j) => (
                    <div key={j}>
                      <p className="text-sm font-medium text-ink-700 mb-1">{topic.name}</p>
                      <a
                        href={topic.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 hover:underline"
                      >
                        {topic.resource}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resume tips */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-brand-500" />
            <h2 className="text-lg font-semibold text-ink-800">Resume & portfolio tips</h2>
          </div>
          <p className="text-sm text-ink-400 mb-4">Quick wins to make your profile stand out</p>
          <div className="space-y-2">
            {report.resumeTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-teal-600">{i + 1}</span>
                </div>
                <p className="text-sm text-ink-600 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transcript replay */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-ink-800 mb-1">Transcript replay</h2>
          <p className="text-sm text-ink-400 mb-4">Review each question, your answer, and per-answer scores</p>
          <div className="space-y-2">
            {report.transcriptReplay.map((item, i) => (
              <ExpandableTranscript key={i} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.print()}
            className="btn-secondary"
          >
            <Download className="w-5 h-5" /> Download PDF report
          </button>
          <button
            onClick={() => navigate({ name: 'profile' })}
            className="btn-primary"
          >
            <RotateCcw className="w-5 h-5" /> Practice again
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
