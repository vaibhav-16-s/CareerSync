import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format, isValid } from 'date-fns';
import { ROLE_HOME } from '@/constants';
import { UserRole } from '@/types';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/**
 * Navigate to a role's home. Admins land on the separate AdminJS panel (an
 * absolute URL on the backend's origin), which react-router's client-side
 * navigate can't target — that needs a real browser navigation. Student/company
 * go through the router as usual. `router` is the `navigate` function from
 * react-router-dom's `useNavigate()`, called as `navigate(href, options)`.
 */
export function goToRoleHome(role, router) {
    const href = ROLE_HOME[role];
    if (role === UserRole.ADMIN) {
        window.location.href = href;
    }
    else {
        router(href, { replace: true });
    }
}
export function formatDate(date, pattern = 'dd MMM yyyy') {
    if (!date)
        return '—';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (!isValid(d))
        return '—';
    return format(d, pattern);
}
export function fromNow(date) {
    if (!date)
        return '—';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (!isValid(d))
        return '—';
    return formatDistanceToNow(d, { addSuffix: true });
}
export function formatCurrency(amount, currency = 'INR') {
    if (!amount)
        return 'Unpaid';
    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0,
        }).format(amount);
    }
    catch {
        return `${currency} ${amount.toLocaleString()}`;
    }
}
export function stipendLabel(stipend) {
    if (!stipend || !stipend.amount)
        return 'Unpaid';
    return `${formatCurrency(stipend.amount, stipend.currency)}/${stipend.period}`;
}
export function initials(name) {
    if (!name)
        return '?';
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('');
}
export function truncate(text, max = 140) {
    if (!text)
        return '';
    return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}
export function slugifyId() {
    return Math.random().toString(36).slice(2, 10);
}
export function pct(value) {
    return `${Math.round(value)}%`;
}
export function deadlineState(deadline) {
    if (!deadline)
        return { label: 'No deadline', urgent: false, passed: false };
    const d = new Date(deadline);
    const now = new Date();
    const passed = d.getTime() < now.getTime();
    const days = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (passed)
        return { label: 'Closed', urgent: false, passed: true };
    return {
        label: days <= 1 ? 'Closes today' : `${days} days left`,
        urgent: days <= 3,
        passed: false,
    };
}
/** Resolve a populated-or-id field to its object form (or undefined). */
export function asObject(value) {
    if (value && typeof value === 'object')
        return value;
    return undefined;
}
/** Resolve a populated-or-id field to a string id. */
export function asId(value) {
    if (!value)
        return '';
    return typeof value === 'object' ? value._id : value;
}
/**
 * Determines whether a nav item should render as active for the current path.
 * Exact match always wins. Prefix matching is used for section roots, but is
 * skipped when another item is a more specific match (e.g. `/x` should not be
 * active when on `/x/new` if `/x/new` is itself a nav item). `allHrefs` lets
 * the caller pass the full item set so the "more specific sibling" rule works.
 */
export function isActivePath(pathname, href, allHrefs = []) {
    if (pathname === href)
        return true;
    if (href === '/' || !pathname.startsWith(`${href}/`))
        return false;
    // If a sibling href is a longer prefix match, defer to it.
    const moreSpecific = allHrefs.some((other) => other !== href &&
        other.startsWith(`${href}/`) &&
        (pathname === other || pathname.startsWith(`${other}/`)));
    return !moreSpecific;
}
