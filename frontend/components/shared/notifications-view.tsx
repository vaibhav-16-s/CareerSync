'use client';

import { useMemo, useState } from 'react';
import { isToday, isThisWeek } from 'date-fns';
import { Bell, BellRing, CheckCheck, FileText, UserPlus, Target, ShieldCheck, type LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { cn, fromNow } from '@/lib/utils';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/hooks/use-notifications';
import { NOTIFICATION_TYPE_LABEL } from '@/constants';
import { NotificationType, type Notification } from '@/types';

const TYPE_STYLE: Record<NotificationType, { icon: LucideIcon; className: string }> = {
  [NotificationType.APPLICATION_STATUS]: {
    icon: FileText,
    className: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
  },
  [NotificationType.NEW_APPLICANT]: {
    icon: UserPlus,
    className: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300',
  },
  [NotificationType.NEW_MATCH]: {
    icon: Target,
    className: 'bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300',
  },
  [NotificationType.COMPANY_VERIFIED]: {
    icon: ShieldCheck,
    className: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300',
  },
  [NotificationType.SYSTEM]: {
    icon: Bell,
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  },
};

type FilterKey = 'all' | 'unread' | NotificationType;

function groupByRecency(items: Notification[]) {
  const today: Notification[] = [];
  const thisWeek: Notification[] = [];
  const earlier: Notification[] = [];
  for (const n of items) {
    const d = new Date(n.createdAt);
    if (isToday(d)) today.push(n);
    else if (isThisWeek(d, { weekStartsOn: 1 })) thisWeek.push(n);
    else earlier.push(n);
  }
  return [
    { label: 'Today', items: today },
    { label: 'This week', items: thisWeek },
    { label: 'Earlier', items: earlier },
  ].filter((g) => g.items.length > 0);
}

export function NotificationsView({ description }: { description: string }) {
  const { data, isLoading } = useNotifications({ limit: 50 });
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const [filter, setFilter] = useState<FilterKey>('all');

  const items = useMemo(() => data?.items ?? [], [data]);

  const typeCounts = useMemo(() => {
    const counts = new Map<NotificationType, number>();
    for (const n of items) counts.set(n.type, (counts.get(n.type) ?? 0) + 1);
    return counts;
  }, [items]);

  if (isLoading) return <Loader label="Loading notifications…" />;

  const total = Number(data?.meta?.total ?? items.length);
  const unread = Number(data?.meta?.unreadCount ?? items.filter((n) => !n.read).length);
  const read = Math.max(0, total - unread);

  const filtered = items.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });
  const groups = groupByRecency(filtered);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Notification Center"
        title={unread > 0 ? `${unread} new update${unread === 1 ? '' : 's'}` : "You're all caught up"}
        description={description}
        icon={BellRing}
        badge={unread}
        stats={[
          { label: 'Total', value: total },
          { label: 'Unread', value: unread },
          { label: 'Read', value: read },
        ]}
        action={
          <Button
            size="sm"
            disabled={unread === 0 || markAll.isPending}
            onClick={() => markAll.mutate()}
          >
            <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === 'all'} label="All" count={total} onClick={() => setFilter('all')} />
        <FilterChip active={filter === 'unread'} label="Unread" count={unread} onClick={() => setFilter('unread')} />
        {Array.from(typeCounts.entries()).map(([type, count]) => (
          <FilterChip
            key={type}
            active={filter === type}
            label={NOTIFICATION_TYPE_LABEL[type]}
            count={count}
            onClick={() => setFilter(type)}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={items.length === 0 ? "You're all caught up" : 'Nothing here'}
          description="New notifications will appear here."
          icon={Bell}
        />
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.label} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-2">
                {group.items.map((n) => (
                  <NotificationRow
                    key={n._id}
                    notification={n}
                    markingRead={markRead.isPending}
                    onMarkRead={() => markRead.mutate(n._id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-transparent bg-muted/60 text-muted-foreground hover:bg-muted'
      )}
    >
      {label}
      <span
        className={cn(
          'rounded-full px-1.5 text-xs',
          active ? 'bg-white/20' : 'bg-background text-foreground/70'
        )}
      >
        {count}
      </span>
    </button>
  );
}

function NotificationRow({
  notification: n,
  markingRead,
  onMarkRead,
}: {
  notification: Notification;
  markingRead: boolean;
  onMarkRead: () => void;
}) {
  const { icon: Icon, className } = TYPE_STYLE[n.type] ?? TYPE_STYLE[NotificationType.SYSTEM];
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 transition-colors',
        !n.read && 'border-primary/40 bg-primary/5'
      )}
    >
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', className)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
          <p className="font-medium">{n.title}</p>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{fromNow(n.createdAt)}</span>
          <span className="rounded-full bg-muted px-2 py-0.5">{NOTIFICATION_TYPE_LABEL[n.type]}</span>
        </div>
      </div>
      {!n.read && (
        <Button variant="ghost" size="sm" disabled={markingRead} onClick={onMarkRead} className="shrink-0">
          Mark read
        </Button>
      )}
    </div>
  );
}
