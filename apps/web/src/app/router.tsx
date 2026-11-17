import { createBrowserRouter } from 'react-router-dom';
import { SignInPage } from '@/features/auth';
import { CoachPage } from '@/features/coach';
import { LogPage } from '@/features/log';
import { OnboardingPage } from '@/features/onboarding';
import { ProgramPage } from '@/features/program';
import { ProgressPage } from '@/features/progress';
import { TodayPage } from '@/features/today';
import { RequireAuth } from './guards/RequireAuth';
import { RequireOnboarded } from './guards/RequireOnboarded';
import { AppShell } from './layout/AppShell';

export const router = createBrowserRouter([
  { path: '/sign-in', element: <SignInPage /> },
  {
    element: <RequireAuth />,
    children: [
      { path: '/onboarding', element: <OnboardingPage /> },
      {
        element: <RequireOnboarded />,
        children: [
          { path: '/log', element: <LogPage /> },
          {
            element: <AppShell />,
            children: [
              { path: '/', element: <TodayPage /> },
              { path: '/program', element: <ProgramPage /> },
              { path: '/progress', element: <ProgressPage /> },
              { path: '/coach', element: <CoachPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
