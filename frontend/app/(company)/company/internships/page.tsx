'use client';

import Link from 'next/link';
import { PlusCircle, Eye, Users, Briefcase, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InternshipStatusBadge } from '@/components/shared/status-badge';
import { useCompanyProfile } from '@/hooks/use-company';
import { useInternships, useDeleteInternship } from '@/hooks/use-internships';
import { InternshipStatus } from '@/types';

export default function CompanyInternshipsPage() {
  const { data: company } = useCompanyProfile();
  const { data, isLoading } = useInternships(company ? { company: company._id, limit: 100 } : undefined);
  const del = useDeleteInternship();

  const items = data?.items ?? [];

  return (
    <>
      <PageHeader
        title="My internships"
        description="Manage your postings and review applicants."
        action={
          <Button asChild>
            <Link href="/company/internships/new">
              <PlusCircle className="mr-1 h-4 w-4" /> Post internship
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <Loader label="Loading your internships…" />
      ) : items.length === 0 ? (
        <EmptyState
          title="No internships yet"
          description="Post your first internship to start receiving applications."
          icon={Briefcase}
          action={<Button asChild><Link href="/company/internships/new">Post internship</Link></Button>}
        />
      ) : (
        <div className="space-y-3">
          {items.map((i) => (
            <Card key={i._id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{i.title}</p>
                    <InternshipStatusBadge status={i.status} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {i.stats?.views ?? 0} views</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {i.stats?.applications ?? 0} applicants</span>
                    <span>{i.location?.remoteOk ? 'Remote' : i.location?.city ?? '—'}</span>
                    {i.deadline && <span>Closes {new Date(i.deadline).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/company/applicants?internshipId=${i._id}`}>Applicants</Link>
                  </Button>
                  {i.status !== InternshipStatus.REMOVED && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      disabled={del.isPending}
                      onClick={() => del.mutate(i._id)}
                      aria-label="Remove internship"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
