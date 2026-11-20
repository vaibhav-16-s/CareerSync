'use client';

import Link from 'next/link';
import { Bookmark, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSavedInternships, useUnsaveInternship } from '@/hooks/use-student';
import type { Company, Internship } from '@/types';

export default function SavedPage() {
  const { data, isLoading } = useSavedInternships();
  const unsave = useUnsaveInternship();

  if (isLoading) return <Loader label="Loading your saved internships…" />;

  // Backend populates each saved row's internshipId; normalize to the internship.
  const items = (data?.items ?? [])
    .map((row) => {
      const raw = row as unknown as { internshipId?: Internship } & Internship;
      return raw.internshipId ?? raw;
    })
    .filter((i): i is Internship => Boolean(i && i._id));

  return (
    <div className="space-y-6">
      <PageHeader title="Saved internships" description="Opportunities you bookmarked to revisit." />

      {items.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          description="Tap the bookmark on any internship to keep it here."
          icon={Bookmark}
          action={
            <Button asChild>
              <Link href="/student/search">Browse internships</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((internship) => {
            const company =
              typeof internship.companyId === 'object'
                ? (internship.companyId as Company)
                : null;
            return (
              <Card key={internship._id}>
                <CardContent className="space-y-3 p-4">
                  <div>
                    <Link
                      href={`/student/internships/${internship._id}`}
                      className="font-medium hover:underline"
                    >
                      {internship.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {company?.name ?? 'Company'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {internship.location?.remoteOk
                      ? 'Remote'
                      : internship.location?.city ?? '—'}
                    {internship.stipend?.amount
                      ? ` · ₹${internship.stipend.amount}/${internship.stipend.period}`
                      : ''}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" asChild>
                      <Link href={`/student/internships/${internship._id}`}>View</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={unsave.isPending}
                      onClick={() => unsave.mutate(internship._id)}
                    >
                      Remove
                    </Button>
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
