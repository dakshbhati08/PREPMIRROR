import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ArrowRight,
  Calendar,
  Clock,
  TrendingUp,
  Mic,
  Award,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { getSessions } from '@/lib/api';
import { useAsync } from '@/hooks/useAsync';
import type { SessionSummary } from '@/types';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function DashboardPage() {
  const { navigate } = useRouter();
  const { data: sessions, loading, error, retry } = useAsync(() => getSessions(), []);

  const chartData = (sessions ?? [])
    .slice()
    .reverse()
    .map((s) => ({ date: formatDate(s.date), score: s.score }));

  const latestScore = sessions?.[0]?.score ?? 0;
  const firstScore = sessions?.[sessions.length - 1]?.score ?? 0;
  const improvement = sessions && sessions.length > 1 ? latestScore - firstScore : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container-max section-padding py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ink-900">Your dashboard</h1>
            <p className="mt-1 text-ink-500">Track your progress over time. Every practice makes you better.</p>
          </div>
          <button onClick={() => navigate({ name: 'profile' })} className="btn-primary">
            <Mic className="w-5 h-5" /> New mock interview
          </button>
        </div>

        {loading && <LoadingSpinner message="Loading your past interviews..." />}

        {error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && sessions && sessions.length === 0 && (
          <EmptyState
            icon={<Mic className="w-8 h-8" />}
            title="No interviews yet"
            description="Your past mock interviews will show up here, along with a progress chart."
            action={
              <button onClick={() => navigate({ name: 'profile' })} className="btn-primary">
                Start your first mock
              </button>
            }
          />
        )}

        {!loading && !error && sessions && sessions.length > 0 && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="card p-5">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                  <Mic className="w-5 h-5 text-brand-600" />
                </div>
                <p className="text-2xl font-bold text-ink-800">{sessions.length}</p>
                <p className="text-sm text-ink-400">Total interviews</p>
              </div>
              <div className="card p-5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-3">
                  <Award className="w-5 h-5 text-teal-600" />
                </div>
                <p className="text-2xl font-bold text-ink-800">{latestScore}</p>
                <p className="text-sm text-ink-400">Latest score</p>
              </div>
              <div className="card p-5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-3">
                  <TrendingUp className={`w-5 h-5 ${improvement >= 0 ? 'text-teal-600' : 'text-amber-600'}`} />
                </div>
                <p className={`text-2xl font-bold ${improvement >= 0 ? 'text-teal-600' : 'text-amber-600'}`}>
                  {improvement >= 0 ? '+' : ''}{improvement}
                </p>
                <p className="text-sm text-ink-400">Improvement</p>
              </div>
              <div className="card p-5">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-brand-600" />
                </div>
                <p className="text-2xl font-bold text-ink-800">
                  {Math.round(sessions.reduce((sum, s) => sum + parseInt(s.duration), 0) / sessions.length)}
                </p>
                <p className="text-sm text-ink-400">Avg minutes</p>
              </div>
            </div>

            {/* Progress chart */}
            <div className="card p-6 mb-6">
              <h2 className="text-lg font-semibold text-ink-800 mb-1">Progress over time</h2>
              <p className="text-sm text-ink-400 mb-5">Your readiness score across all mock interviews</p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '13px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#1ba9e0"
                    strokeWidth={3}
                    dot={{ fill: '#1ba9e0', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Session list */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-ink-800 mb-4">Past interviews</h2>
              <div className="space-y-2">
                {sessions.map((s) => (
                  <button
                    key={s.sessionId}
                    onClick={() => navigate({ name: 'report', sessionId: s.sessionId })}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-ink-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all text-left group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-teal-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-brand-600">{s.score}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-800 truncate">{s.targetRole}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-ink-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(s.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {s.duration}
                        </span>
                      </div>
                    </div>
                    {/* Score bar */}
                    <div className="hidden sm:block w-24 h-2 bg-ink-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.score >= 75 ? 'bg-teal-400' : s.score >= 60 ? 'bg-brand-400' : 'bg-amber-400'}`}
                        style={{ width: `${s.score}%` }}
                      />
                    </div>
                    <ChevronRight className="w-5 h-5 text-ink-300 group-hover:text-brand-500 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <p className="text-sm text-ink-500 mb-3">Keep the momentum going!</p>
              <button onClick={() => navigate({ name: 'profile' })} className="btn-primary">
                Practice again <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
