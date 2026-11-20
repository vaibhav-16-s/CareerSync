import type { Step } from 'react-joyride';

// Targets match the `data-tour="nav-<href>"` attribute SidebarNav stamps on
// every sidebar link (see components/layout/sidebar-nav.tsx).
export function getStudentTourSteps(name?: string): Step[] {
  return [
    {
      target: 'body',
      placement: 'center',
      skipBeacon: true,
      title: `Welcome to CareerSync${name ? `, ${name}` : ''}!`,
      content: "Let's take a 60-second tour of your dashboard.",
    },
    {
      target: '[data-tour="nav-/student/dashboard"]',
      placement: 'right',
      title: 'Your dashboard',
      content: 'See your profile strength, active applications and recommended internships at a glance.',
    },
    {
      target: '[data-tour="nav-/student/search"]',
      placement: 'right',
      title: 'Find internships',
      content: 'Search and filter internships by skill, stipend, location, remote-friendliness and more.',
    },
    {
      target: '[data-tour="nav-/student/applications"]',
      placement: 'right',
      title: 'Track your applications',
      content: 'Follow every application from pending to hired, right here.',
    },
    {
      target: '[data-tour="nav-/student/skills"]',
      placement: 'right',
      title: 'Build your profile',
      content: 'Add skills, projects and your resume — a complete profile means stronger, more explainable match scores.',
    },
    {
      target: '[data-tour="nav-/student/notifications"]',
      placement: 'right',
      title: 'Stay in the loop',
      content: "We'll notify you here the moment a company reviews your application.",
    },
  ];
}

export function getCompanyTourSteps(name?: string): Step[] {
  return [
    {
      target: 'body',
      placement: 'center',
      skipBeacon: true,
      title: `Welcome to CareerSync${name ? `, ${name}` : ''}!`,
      content: "Here's a quick tour of your hiring workspace.",
    },
    {
      target: '[data-tour="nav-/company/dashboard"]',
      placement: 'right',
      title: 'Your dashboard',
      content: 'Track applications, views and hiring performance at a glance.',
    },
    {
      target: '[data-tour="nav-/company/internships/new"]',
      placement: 'right',
      title: 'Post an internship',
      content: 'Create your first listing in a couple of minutes.',
    },
    {
      target: '[data-tour="nav-/company/applicants"]',
      placement: 'right',
      title: 'Review applicants',
      content: 'See every candidate ranked by an explainable match score.',
    },
    {
      target: '[data-tour="nav-/company/pipeline"]',
      placement: 'right',
      title: 'Hiring pipeline',
      content: 'Move candidates through your stages on a Kanban board, from applied to hired.',
    },
    {
      target: '[data-tour="nav-/company/profile"]',
      placement: 'right',
      title: 'Complete your profile',
      content: 'Submit verification so your internships go live and become visible to students.',
    },
  ];
}
