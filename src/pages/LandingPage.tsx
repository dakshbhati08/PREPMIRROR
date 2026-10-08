import {
  Upload,
  Mic,
  FileBarChart,
  Map,
  GraduationCap,
  Code2,
  Briefcase,
  Lock,
  HeartHandshake,
  Target,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export function LandingPage() {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-200/30 rounded-full blur-3xl" />
          <div className="absolute top-40 -left-20 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl" />
        </div>

        <div className="container-max section-padding relative py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                No judgment. Just practice.
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-900 leading-[1.1] tracking-tight">
                Practice interviews{' '}
                <span className="bg-gradient-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent">
                  without the fear
                </span>
              </h1>
              <p className="mt-6 text-lg text-ink-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Your AI interviewer reads your resume and portfolio, asks personalized questions,
                and tells you exactly what to work on — all in a calm, supportive space.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => navigate({ name: 'profile' })}
                  className="btn-primary text-base"
                >
                  Start free mock interview
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate({ name: 'dashboard' })}
                  className="btn-secondary text-base"
                >
                  View dashboard
                </button>
              </div>
              <p className="mt-4 text-xs text-ink-400">No signup required. Audio deleted after transcription.</p>
            </div>

            {/* Hero illustration card */}
            <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <div className="card p-6 shadow-lg max-w-md mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-800">AI Interviewer</p>
                    <p className="text-xs text-teal-600">Online & ready</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-brand-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-ink-700">Let's start easy — tell me a bit about yourself.</p>
                  </div>
                  <div className="bg-ink-100 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] ml-auto">
                    <p className="text-sm text-ink-600">I've been learning web dev for a year now...</p>
                  </div>
                  <div className="bg-brand-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-ink-700">Nice answer! Let's talk about your project next.</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {[3, 5, 4, 7, 6, 5, 8, 4, 6, 3].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-brand-400 rounded-full animate-wave"
                        style={{ height: `${h * 3}px`, animationDelay: `${i * 0.08}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-ink-400">Question 2 of 8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container-max section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900">How it works</h2>
            <p className="mt-3 text-ink-500 max-w-xl mx-auto">Four simple steps from nervous to confident.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Upload, title: 'Upload resume', desc: 'Share your resume so the AI can tailor questions to your experience.' },
              { icon: Mic, title: 'Talk to the AI interviewer', desc: 'Answer questions by voice, just like a real interview — but at your own pace.' },
              { icon: FileBarChart, title: 'Get your readiness report', desc: 'See your score across skills, with quotes from your own answers.' },
              { icon: Map, title: 'Follow your learning roadmap', desc: 'A prioritized week-by-week plan with free resources to close the gaps.' },
            ].map((step, i) => (
              <div key={i} className="card p-6 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-teal-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6 text-brand-600" />
                </div>
                <div className="text-xs font-semibold text-brand-500 mb-1">Step {i + 1}</div>
                <h3 className="text-lg font-semibold text-ink-800 mb-2">{step.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 sm:py-24 bg-ink-50">
        <div className="container-max section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900">Who it's for</h2>
            <p className="mt-3 text-ink-500 max-w-xl mx-auto">If job prep feels overwhelming, you're in the right place.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                title: 'Tier-2/3 college students',
                desc: 'Limited campus placements? Practice like you have a personal interview coach.',
              },
              {
                icon: Code2,
                title: 'Self-taught developers',
                desc: 'No CS degree, no problem. Show your projects and get feedback that matters.',
              },
              {
                icon: Briefcase,
                title: 'Non-tech graduates',
                desc: 'Switching careers? Build confidence answering technical questions in plain language.',
              },
            ].map((card, i) => (
              <div key={i} className="card p-8 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-100 to-teal-100 flex items-center justify-center mx-auto mb-5">
                  <card.icon className="w-8 h-8 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-ink-800 mb-2">{card.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why different */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container-max section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900">Why PrepMirror is different</h2>
            <p className="mt-3 text-ink-500 max-w-xl mx-auto">Not just another practice tool. A space that actually understands you.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Lock, title: 'Private', desc: 'Your audio is deleted after transcription. No one listens.' },
              { icon: HeartHandshake, title: 'No judgment', desc: "Mess up? That's the point. Every attempt makes you better." },
              { icon: Target, title: 'Personalized', desc: 'Questions are tailored to your own resume and portfolio.' },
              { icon: Sparkles, title: 'Actionable feedback', desc: 'Not "be more confident" — specific things you can fix this week.' },
            ].map((item, i) => (
              <div key={i} className="card p-6 border-2 border-transparent hover:border-brand-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-base font-semibold text-ink-800 mb-1.5">{item.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-brand-600 to-teal-500">
        <div className="container-max section-padding text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to practice?</h2>
          <p className="mt-3 text-brand-50 max-w-xl mx-auto">Your first mock interview takes 10 minutes. No signup, no pressure.</p>
          <button
            onClick={() => navigate({ name: 'profile' })}
            className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-brand-700 font-semibold text-base hover:bg-brand-50 active:scale-95 transition-all"
          >
            Start free mock interview
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
