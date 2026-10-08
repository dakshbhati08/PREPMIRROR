import { RouterProvider, useRouter } from '@/lib/router';
import { LandingPage } from '@/pages/LandingPage';
import { ProfileSetupPage } from '@/pages/ProfileSetupPage';
import { InterviewRoomPage } from '@/pages/InterviewRoomPage';
import { ReportPage } from '@/pages/ReportPage';
import { DashboardPage } from '@/pages/DashboardPage';

function Pages() {
  const { route } = useRouter();

  switch (route.name) {
    case 'landing':
      return <LandingPage />;
    case 'profile':
      return <ProfileSetupPage />;
    case 'interview':
      return <InterviewRoomPage sessionId={route.sessionId} profileId={route.profileId} />;
    case 'report':
      return <ReportPage sessionId={route.sessionId} />;
    case 'dashboard':
      return <DashboardPage />;
    default:
      return <LandingPage />;
  }
}

export default function App() {
  return (
    <RouterProvider>
      <Pages />
    </RouterProvider>
  );
}
