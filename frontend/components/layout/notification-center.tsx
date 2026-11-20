'use client';

import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader } from '@/components/ui/loader';
import { EmptyState } from '@/components/shared/empty-state';
import { cn, fromNow } from '@/lib/utils';
import {
  useNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '@/hooks/use-notifications';
import { useNotificationStore } from '@/store/notification.store';
import { NOTIFICATION_TYPE_LABEL } from '@/constants';

export function NotificationCenter() {
  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const items = data?.items ?? [];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="flex-row items-center justify-between border-b p-4">
          <SheetTitle>Notifications</SheetTitle>
          {items.some((n) => !n.read) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
            >
              <CheckCheck className="mr-1 h-4 w-4" /> Mark all read
            </Button>
          )}
        </SheetHeader>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <Loader label="Loading…" />
          ) : items.length === 0 ? (
            <div className="p-6">
              <EmptyState title="You're all caught up" description="No notifications yet." icon={Bell} />
            </div>
          ) : (
            <ul className="divide-y">
              {items.map((n) => (
                <li
                  key={n._id}
                  className={cn('p-4 transition-colors', !n.read && 'bg-primary/5')}
                  onClick={() => !n.read && markRead.mutate(n._id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-primary">
                      {NOTIFICATION_TYPE_LABEL[n.type] ?? 'Update'}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {fromNow(n.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.body}</p>
                  {!n.read && (
                    <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
