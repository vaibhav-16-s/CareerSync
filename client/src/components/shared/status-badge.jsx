import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { APPLICATION_STATUS_META, INTERNSHIP_STATUS_META, USER_STATUS_META, VERIFICATION_STATUS_META, } from '@/constants';
export function ApplicationStatusBadge({ status }) {
    const meta = APPLICATION_STATUS_META[status];
    return <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', meta?.color)}>{meta?.label ?? status}</span>;
}
export function InternshipStatusBadge({ status }) {
    const meta = INTERNSHIP_STATUS_META[status];
    return <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', meta?.color)}>{meta?.label ?? status}</span>;
}
export function VerificationBadge({ status }) {
    const meta = VERIFICATION_STATUS_META[status];
    return <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', meta?.color)}>{meta?.label ?? status}</span>;
}
export function UserStatusBadge({ status }) {
    const meta = USER_STATUS_META[status];
    return <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', meta?.color)}>{meta?.label ?? status}</span>;
}
export function MatchScoreBadge({ score }) {
    const variant = score >= 75 ? 'success' : score >= 50 ? 'secondary' : 'outline';
    return <Badge variant={variant}>{Math.round(score)}% match</Badge>;
}
