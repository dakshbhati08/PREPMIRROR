import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { useRouter, type Route } from '@/lib/router';

export function Navbar() {
  const { route, navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links: { label: string; route: Route }[] = [
    { label: 'Home', route: { name: 'landing' } },
    { label: 'Dashboard', route: { name: 'dashboard' } },
  ];

  const isActive = (r: Route) => r.name === route.name;

  const go = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-ink-200">
      <div className="container-max section-padding flex items-center justify-between h-16">
        <button onClick={() => go({ name: 'landing' })} className="focus:outline-none focus:ring-4 focus:ring-brand-100 rounded-lg" aria-label="PrepMirror home">
          <Logo />
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => go(l.route)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(l.route) ? 'text-brand-700 bg-brand-50' : 'text-ink-600 hover:text-ink-800 hover:bg-ink-100'
              }`}
            >
              {l.label}
            </button>
          ))}
          <button onClick={() => go({ name: 'profile' })} className="btn-primary !px-5 !py-2 ml-2 text-sm">
            Start free mock
          </button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-ink-600 hover:bg-ink-100"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-ink-200 bg-white animate-fade-in">
          <div className="section-padding py-3 flex flex-col gap-1">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => go(l.route)}
                className={`px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                  isActive(l.route) ? 'text-brand-700 bg-brand-50' : 'text-ink-600 hover:bg-ink-100'
                }`}
              >
                {l.label}
              </button>
            ))}
            <button onClick={() => go({ name: 'profile' })} className="btn-primary mt-2">
              Start free mock
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
