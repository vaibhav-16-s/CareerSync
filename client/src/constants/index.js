import { ApplicationStatus, InternshipStatus, NotificationType, Proficiency, UserRole, UserStatus, VerificationStatus, } from '@/types';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'InternBridge';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
// Admins don't get a page in this app — they manage the platform through the
// separate AdminJS panel the backend mounts at /admin (its own session-based
// login, unrelated to the JWT auth used here). Derived from API_URL by
// stripping the `/api/v1`-style prefix back to the backend's origin.
export const ADMIN_PANEL_URL = `${API_URL.replace(/\/api\/.*$/, '')}/admin`;
export const ACCESS_TOKEN_KEY = 'ib_access_token';
export const AUTH_STORAGE_KEY = 'ib-auth';
// ---------- Role landing routes ----------
// STUDENT/COMPANY are internal app routes (safe for the React Router).
// ADMIN is an absolute URL to the separate AdminJS panel — never pass it to
// `navigate()`, only to a plain `<a>`/`<Link>` or
// `window.location`. Use `goToRoleHome` below to route correctly either way.
export const ROLE_HOME = {
    [UserRole.STUDENT]: '/student/dashboard',
    [UserRole.COMPANY]: '/company/dashboard',
    [UserRole.ADMIN]: ADMIN_PANEL_URL,
};
// ---------- Badges / colors ----------
export const APPLICATION_STATUS_META = {
    [ApplicationStatus.PENDING]: {
        label: 'Pending',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    },
    [ApplicationStatus.SHORTLISTED]: {
        label: 'Shortlisted',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    },
    [ApplicationStatus.HIRED]: {
        label: 'Hired',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    },
    [ApplicationStatus.REJECTED]: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    },
    [ApplicationStatus.WITHDRAWN]: {
        label: 'Withdrawn',
        color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
};
export const VERIFICATION_STATUS_META = {
    [VerificationStatus.PENDING]: {
        label: 'Pending',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    },
    [VerificationStatus.VERIFIED]: {
        label: 'Verified',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    },
    [VerificationStatus.REJECTED]: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    },
};
export const INTERNSHIP_STATUS_META = {
    [InternshipStatus.DRAFT]: {
        label: 'Draft',
        color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    [InternshipStatus.ACTIVE]: {
        label: 'Active',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    },
    [InternshipStatus.CLOSED]: {
        label: 'Closed',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    },
    [InternshipStatus.REMOVED]: {
        label: 'Removed',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    },
};
export const USER_STATUS_META = {
    [UserStatus.ACTIVE]: {
        label: 'Active',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    },
    [UserStatus.PENDING]: {
        label: 'Pending',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    },
    [UserStatus.SUSPENDED]: {
        label: 'Suspended',
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    },
    [UserStatus.BANNED]: {
        label: 'Banned',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    },
};
export const PROFICIENCY_OPTIONS = [
    { value: Proficiency.BEGINNER, label: 'Beginner' },
    { value: Proficiency.INTERMEDIATE, label: 'Intermediate' },
    { value: Proficiency.ADVANCED, label: 'Advanced' },
];
export const NOTIFICATION_TYPE_LABEL = {
    [NotificationType.APPLICATION_STATUS]: 'Application update',
    [NotificationType.NEW_APPLICANT]: 'New applicant',
    [NotificationType.NEW_MATCH]: 'New match',
    [NotificationType.COMPANY_VERIFIED]: 'Verification',
    [NotificationType.SYSTEM]: 'System',
};
export const INTERNSHIP_SORT_OPTIONS = [
    { value: 'recent', label: 'Most recent' },
    { value: 'stipend', label: 'Highest stipend' },
    { value: 'deadline', label: 'Closing soon' },
];
export const YEAR_OPTIONS = [1, 2, 3, 4, 5, 6].map((y) => ({
    value: String(y),
    label: `Year ${y}`,
}));
export const PAGE_SIZE = 12;
