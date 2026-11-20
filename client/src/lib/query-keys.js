// Centralized TanStack Query keys — keeps invalidation consistent & typo-free.
export const qk = {
    auth: {
        me: ['auth', 'me'],
    },
    student: {
        me: ['student', 'me'],
        dashboard: ['student', 'dashboard'],
        saved: (params) => ['student', 'saved', params ?? {}],
        applications: (params) => ['student', 'applications', params ?? {}],
    },
    company: {
        me: ['company', 'me'],
        byId: (id) => ['company', 'byId', id],
        analytics: ['company', 'analytics'],
        applicants: (params) => ['company', 'applicants', params ?? {}],
    },
    internships: {
        list: (filters) => ['internships', 'list', filters ?? {}],
        detail: (id) => ['internships', 'detail', id],
        applications: (id, params) => ['internships', 'applications', id, params ?? {}],
    },
    notifications: {
        list: (params) => ['notifications', 'list', params ?? {}],
    },
    ai: {
        match: (id) => ['ai', 'match', id],
        skillGap: (params) => ['ai', 'skill-gap', params ?? {}],
        recommendations: ['ai', 'recommendations'],
        resumeFeedback: (role) => ['ai', 'resume-feedback', role ?? ''],
        candidates: (id) => ['ai', 'candidates', id],
    },
    admin: {
        users: (params) => ['admin', 'users', params ?? {}],
        pendingCompanies: (params) => ['admin', 'pending-companies', params ?? {}],
        analytics: ['admin', 'analytics'],
    },
};
