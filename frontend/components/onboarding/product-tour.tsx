'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { EventData, Step } from 'react-joyride';
import { STATUS } from 'react-joyride';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types';
import { getStudentTourSteps, getCompanyTourSteps } from './tour-steps';
import { TourTooltip } from './tour-tooltip';

// react-joyride manipulates the DOM directly and has no useful server render.
const Joyride = dynamic(() => import('react-joyride').then((m) => m.Joyride), { ssr: false });

// Keyed by email rather than `user.id` — the auth payload only ever carries
// `_id` in practice, so `.id` is reliably undefined and would collapse every
// account into the same key.
function tourSeenKey(email: string) {
  return `ib-onboarding-seen:${email}`;
}

/**
 * First-visit walkthrough for students and companies, spotlighting the
 * sidebar. Admins are skipped (no frontend portal — see ADMIN_PANEL_URL) and
 * so are small screens (the tour targets the desktop sidebar, hidden on
 * mobile). "Seen" is remembered per browser via localStorage, keyed by user.
 */
export function ProductTour() {
  const user = useAuthStore((s) => s.user);
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    setRun(false);
    setSteps([]);

    if (!user || (user.role !== UserRole.STUDENT && user.role !== UserRole.COMPANY)) return;
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    if (localStorage.getItem(tourSeenKey(user.email))) return;

    const name = user.email.split('@')[0];
    setSteps(user.role === UserRole.STUDENT ? getStudentTourSteps(name) : getCompanyTourSteps(name));

    // Let the sidebar mount before Joyride measures its targets.
    const timer = setTimeout(() => setRun(true), 700);
    return () => clearTimeout(timer);
  }, [user]);

  const handleEvent = ({ status }: EventData) => {
    if ((status === STATUS.FINISHED || status === STATUS.SKIPPED) && user) {
      setRun(false);
      localStorage.setItem(tourSeenKey(user.email), '1');
    }
  };

  if (!steps.length) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      onEvent={handleEvent}
      tooltipComponent={TourTooltip}
      options={{
        zIndex: 10000,
        spotlightRadius: 8,
        overlayColor: 'rgba(15, 23, 42, 0.5)',
      }}
    />
  );
}
