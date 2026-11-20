import type { InternshipFilters } from '@/types';

// Centralized TanStack Query keys — keeps invalidation consistent & typo-free.
export const qk = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  student: {
    me: ['student', 'me'] as const,
    dashboard: ['student', 'dashboard'] as const,
    saved: (params?: Record<string, unknown>) =>
      ['student', 'saved', params ?? {}] as const,
    applications: (params?: Record<string, unknown>) =>
      ['student', 'applications', params ?? {}] as const,
  },
  company: {
    me: ['company', 'me'] as const,
    byId: (id: string) => ['company', 'byId', id] as const,
    analytics: ['company', 'analytics'] as const,
    applicants: (params?: Record<string, unknown>) =>
      ['company', 'applicants', params ?? {}] as const,
  },
  internships: {
    list: (filters?: InternshipFilters) =>
      ['internships', 'list', filters ?? {}] as const,
    detail: (id: string) => ['internships', 'detail', id] as const,
    applications: (id: string, params?: Record<string, unknown>) =>
      ['internships', 'applications', id, params ?? {}] as const,
  },
  notifications: {
    list: (params?: Record<string, unknown>) =>
      ['notifications', 'list', params ?? {}] as const,
  },
  ai: {
    match: (id: string) => ['ai', 'match', id] as const,
    skillGap: (params?: Record<string, unknown>) =>
      ['ai', 'skill-gap', params ?? {}] as const,
    recommendations: ['ai', 'recommendations'] as const,
    resumeFeedback: (role?: string) => ['ai', 'resume-feedback', role ?? ''] as const,
    candidates: (id: string) => ['ai', 'candidates', id] as const,
  },
  admin: {
    users: (params?: Record<string, unknown>) =>
      ['admin', 'users', params ?? {}] as const,
    pendingCompanies: (params?: Record<string, unknown>) =>
      ['admin', 'pending-companies', params ?? {}] as const,
    analytics: ['admin', 'analytics'] as const,
  },
} as const;
