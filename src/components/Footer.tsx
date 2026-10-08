import { ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { useRouter, type Route } from '@/lib/router';

export function Footer() {
  const { navigate } = useRouter();

  const links: { label: string; route: Route }[] = [
    { label: 'Home', route: { name: 'landing' } },
    { label: 'Dashboard', route: { name: 'dashboard' } },
    { label: 'Start mock interview', route: { name: 'profile' } },
  ];

  return (
    <footer className="bg-white border-t border-ink-200 mt-16">
      <div className="container-max section-padding py-10">
        <div className="flex flex-col md:flex-row items-start gap-8 justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-3 text-sm text-ink-500 leading-relaxed">
              A low-stakes, friendly space to practice interviews and get a detailed diagnosis of your readiness.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => navigate(l.route)}
                className="text-sm text-ink-600 hover:text-brand-600 transition-colors text-left"
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-ink-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-400">&copy; 2026 PrepMirror. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-ink-500">
            <ShieldCheck className="w-4 h-4 text-teal-500" />
            <span>Your audio is deleted after transcription.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
