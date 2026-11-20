'use client';

import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ApplicationStatusBadge, MatchScoreBadge } from '@/components/shared/status-badge';
import { useMyApplications, useWithdrawApplication } from '@/hooks/use-applications';
import { ApplicationStatus, type Internship } from '@/types';

export default function ApplicationsPage() {
  const { data, isLoading } = useMyApplications();
  const withdraw = useWithdrawApplication();

  if (isLoading) return <Loader label="Loading your applications…" />;

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My applications"
        description="Track every internship you've applied to and its status."
      />

      {items.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Browse internships and apply — they'll show up here."
          icon={Briefcase}
          action={
            <Button asChild>
              <Link href="/student/search">Find internships</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {items.map((app) => {
            const internship =
              typeof app.internshipId === 'object' ? (app.internshipId as Internship) : null;
            const canWithdraw =
              app.status !== ApplicationStatus.WITHDRAWN &&
              app.status !== ApplicationStatus.HIRED;
            return (
              <Card key={app._id} className="transition-colors hover:border-primary/40">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  {/* Left: icon + title + meta (grows to fill the row) */}
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
                      <Briefcase className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">
                          {internship?.title ?? 'Internship'}
                        </p>
                        <ApplicationStatusBadge status={app.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                        {internship?.location?.city ? ` · ${internship.location.city}` : ''}
                        {internship?.stipend?.amount
                          ? ` · ₹${internship.stipend.amount.toLocaleString('en-IN')}/${internship.stipend.period}`
                          : ''}
                      </p>
                    </div>
                  </div>

                  {/* Right: grouped card-form cluster (match + actions) */}
                  <div className="flex shrink-0 items-center gap-2 rounded-xl border bg-muted/30 px-3 py-2 sm:gap-3">
                    <MatchScoreBadge score={app.matchScore} />
                    <div className="hidden h-6 w-px bg-border sm:block" />
                    {internship && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/student/internships/${internship._id}`}>View</Link>
                      </Button>
                    )}
                    {canWithdraw && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={withdraw.isPending}
                        onClick={() => withdraw.mutate(app._id)}
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
