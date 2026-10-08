import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Route =
  | { name: 'landing' }
  | { name: 'profile' }
  | { name: 'interview'; sessionId: string; profileId: string }
  | { name: 'report'; sessionId: string }
  | { name: 'dashboard' };

interface RouterContextValue {
  route: Route;
  navigate: (route: Route) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [path, ...rest] = hash.split('/');
  switch (path) {
    case 'profile':
      return { name: 'profile' };
    case 'interview': {
      const sessionId = rest[0] ?? '';
      const profileId = rest[1] ?? '';
      if (sessionId) return { name: 'interview', sessionId, profileId };
      return { name: 'landing' };
    }
    case 'report': {
      const sessionId = rest[0] ?? '';
      if (sessionId) return { name: 'report', sessionId };
      return { name: 'landing' };
    }
    case 'dashboard':
      return { name: 'dashboard' };
    default:
      return { name: 'landing' };
  }
}

function routeToHash(route: Route): string {
  switch (route.name) {
    case 'landing':
      return '#/';
    case 'profile':
      return '#/profile';
    case 'interview':
      return `#/interview/${route.sessionId}/${route.profileId}`;
    case 'report':
      return `#/report/${route.sessionId}`;
    case 'dashboard':
      return '#/dashboard';
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseHash());

  useEffect(() => {
    const handler = () => setRoute(parseHash());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = useCallback((newRoute: Route) => {
    window.location.hash = routeToHash(newRoute);
    setRoute(newRoute);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
