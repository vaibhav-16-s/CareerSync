'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Wallet,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader } from '@/components/ui/loader';
import { ErrorState } from '@/components/shared/error-state';
import { InternshipStatusBadge } from '@/components/shared/status-badge';
import { ExternalLink } from '@/components/shared/external-link';
import { MatchPanel } from '@/features/ai/match-panel';
import { ApplyDialog } from '@/features/internships/apply-dialog';
import { useInternship } from '@/hooks/use-internships';
import {
  useSavedInternships,
  useSaveInternship,
  useUnsaveInternship,
} from '@/hooks/use-student';
import { asObject, deadlineState, formatDate, stipendLabel } from '@/lib/utils';
import { InternshipStatus } from '@/types';

export default function InternshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [applyOpen, setApplyOpen] = useState(false);

  const { data: internship, isLoading, isError, refetch } = useInternship(id);
  const { data: saved } = useSavedInternships({ limit: 100 });
  const save = useSaveInternship();
  const unsave = useUnsaveInternship();

  if (isLoading) return <Loader label="Loading internship…" />;
  if (isError || !internship) return <ErrorState onRetry={refetch} />;

  const company = asObject(internship.companyId);
  const isSaved = (saved?.items ?? []).some((i) => i._id === internship._id);
  const deadline = deadlineState(internship.deadline);
  const closed =
    internship.status !== InternshipStatus.ACTIVE || deadline.passed;

  return (
    <>
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" onClick={() => router.back()}>
        <ArrowLeft className="mr-1 h-4 w-4" /> Back
      </Button>

      <PageHeader
        title={internship.title}
        description={company?.name}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                isSaved ? unsave.mutate(internship._id) : save.mutate(internship._id)
              }
              disabled={save.isPending || unsave.isPending}
            >
              {isSaved ? (
                <BookmarkCheck className="mr-1 h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="mr-1 h-4 w-4" />
              )}
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button onClick={() => setApplyOpen(true)} disabled={closed}>
              {closed ? 'Closed' : 'Apply now'}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Key facts */}
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
              <Fact icon={MapPin} label="Location" value={internship.location.remoteOk ? 'Remote' : internship.location.city || 'On-site'} />
              <Fact icon={Wallet} label="Stipend" value={stipendLabel(internship.stipend)} />
              <Fact icon={Clock} label="Duration" value={internship.duration || 'Flexible'} />
              <Fact icon={Users} label="Openings" value={String(internship.openings)} />
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>About this role</CardTitle>
              <InternshipStatusBadge status={internship.status} />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {internship.description}
              </p>

              <Separator />

              <div>
                <h4 className="mb-2 text-sm font-semibold">Required skills</h4>
                <div className="flex flex-wrap gap-2">
                  {internship.requiredSkills.map((s) => (
                    <Badge key={s.skillId} variant="secondary" className="font-normal">
                      {s.name}
                      <span className="ml-1 text-[10px] text-muted-foreground">
                        · {s.minProficiency}
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>

              {internship.niceToHaveSkills.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Nice to have</h4>
                  <div className="flex flex-wrap gap-2">
                    {internship.niceToHaveSkills.map((s) => (
                      <Badge key={s.skillId} variant="outline" className="font-normal">
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Deadline: {formatDate(internship.deadline)}
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Eligible: Year {internship.eligibility.minYear ?? 'any'}–
                  {internship.eligibility.maxYear ?? 'any'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Company */}
          {company && (
            <Card>
              <CardHeader>
                <CardTitle>About {company.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {company.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{company.name}</p>
                    {company.industry && (
                      <p className="text-sm text-muted-foreground">{company.industry}</p>
                    )}
                  </div>
                </div>
                {company.description && (
                  <p className="text-sm text-muted-foreground">{company.description}</p>
                )}
                {company.website && (
                  <ExternalLink
                    href={company.website}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Visit website →
                  </ExternalLink>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI match sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <MatchPanel internshipId={internship._id} />
          <Button className="w-full" size="lg" onClick={() => setApplyOpen(true)} disabled={closed}>
            {closed ? 'Applications closed' : 'Apply now'}
          </Button>
        </aside>
      </div>

      <ApplyDialog
        internshipId={internship._id}
        internshipTitle={internship.title}
        open={applyOpen}
        onOpenChange={setApplyOpen}
      />
    </>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-muted p-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
