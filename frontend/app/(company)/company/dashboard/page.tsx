'use client';

import Link from 'next/link';
import {
  Briefcase,
  Users,
  Eye,
  FileText,
  Target,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  CheckCircle2,
  Clock,
  Filter,
  XCircle,
  Undo2,
  Percent,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { EmptyState } from '@/components/shared/empty-state';
import { PipelineFunnel } from '@/components/shared/charts';
import { useCompanyAnalytics, useCompanyProfile } from '@/hooks/use-company';
import { VerificationStatus } from '@/types';

export default function CompanyDashboardPage() {
  const { data: company } = useCompanyProfile();
  const { data, isLoading } = useCompanyAnalytics();

  if (isLoading) return <Loader label="Loading your dashboard…" />;

  const stats = data?.internships;
  const funnel = data?.applicationFunnel ?? {};
  const funnelData = [
    { name: 'Pending', value: funnel.pending ?? 0 },
    { name: 'Shortlisted', value: funnel.shortlisted ?? 0 },
    { name: 'Hired', value: funnel.hired ?? 0 },
    { name: 'Rejected', value: funnel.rejected ?? 0 },
  ];
  const totalApps = funnelData.reduce((a, b) => a + b.value, 0);
  const verification = data?.verification ?? company?.verification?.status;
  const hireRate = totalApps ? Math.round(((funnel.hired ?? 0) / totalApps) * 100) : 0;
  const shortlistRate = totalApps ? Math.round(((funnel.shortlisted ?? 0) / totalApps) * 100) : 0;
  const viewToApplyRate = stats?.totalViews
    ? Math.round(((stats.totalApplications ?? 0) / stats.totalViews) * 100)
    : 0;

  return (
    <>
      <PageHeader
        title={`Welcome${company ? `, ${company.name}` : ''}`}
        description="Your hiring at a glance."
        action={
          <Button asChild>
            <Link href="/company/internships/new">
              <PlusCircle className="mr-1 h-4 w-4" /> Post internship
            </Link>
          </Button>
        }
      />

      {/* Verification banner */}
      <VerificationBanner status={verification} />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active internships" value={stats?.active ?? 0} icon={Briefcase} />
        <StatCard label="Total applications" value={stats?.totalApplications ?? 0} icon={Users} />
        <StatCard label="Total views" value={stats?.totalViews ?? 0} icon={Eye} />
        <StatCard label="Avg. match score" value={`${data?.averageMatchScore ?? 0}%`} icon={Target} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Application funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Application pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            {totalApps === 0 ? (
              <EmptyState
                title="No applications yet"
                description="They'll appear here as students apply."
                icon={FileText}
              />
            ) : (
              <PipelineFunnel data={funnelData} height={240} />
            )}
          </CardContent>
        </Card>

        {/* Application breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Application breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Metric icon={Clock} label="Pending" value={funnel.pending ?? 0} />
            <Metric icon={Filter} label="Shortlisted" value={funnel.shortlisted ?? 0} />
            <Metric icon={CheckCircle2} label="Hired" value={funnel.hired ?? 0} />
            <Metric icon={XCircle} label="Rejected" value={funnel.rejected ?? 0} />
            <Metric icon={Undo2} label="Withdrawn" value={funnel.withdrawn ?? 0} />
          </CardContent>
        </Card>

        {/* Key metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Key metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Metric icon={Target} label="Application → hire rate" value={`${hireRate}%`} />
            <Metric icon={Percent} label="Shortlist rate" value={`${shortlistRate}%`} />
            <Metric icon={TrendingUp} label="View → application rate" value={`${viewToApplyRate}%`} />
            <Metric
              icon={Eye}
              label="Views per internship"
              value={stats?.total ? Math.round((stats.totalViews ?? 0) / stats.total) : 0}
            />
          </CardContent>
        </Card>
      </div>

      {/* Top internships */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Top internships</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/company/internships">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {!data?.topInternships?.length ? (
            <EmptyState
              title="No internships posted"
              description="Post your first internship to start hiring."
              icon={Briefcase}
              action={
                <Button asChild>
                  <Link href="/company/internships/new">Post internship</Link>
                </Button>
              }
            />
          ) : (
            data.topInternships.map((i) => (
              <div key={i._id} className="flex items-center justify-between rounded-lg border p-3">
                <p className="min-w-0 truncate font-medium">{i.title}</p>
                <div className="flex shrink-0 items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {i.stats?.views ?? 0}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {i.stats?.applications ?? 0}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <span className="flex items-center gap-2 text-sm text-muted-foreground"><Icon className="h-4 w-4" /> {label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function VerificationBanner({ status }: { status?: VerificationStatus }) {
  if (status === VerificationStatus.VERIFIED) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
        <ShieldCheck className="h-5 w-5 shrink-0" />
        Your company is verified — your internships are live and visible to students.
      </div>
    );
  }
  if (status === VerificationStatus.REJECTED) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
        <span className="flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          Verification was rejected. Update your details and resubmit.
        </span>
        <Button variant="outline" size="sm" asChild><Link href="/company/profile">Resubmit</Link></Button>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
      <span className="flex items-center gap-3">
        <ShieldQuestion className="h-5 w-5 shrink-0" />
        Your company isn&apos;t verified yet. Verify to publish internships and appear in search.
      </span>
      <Button variant="outline" size="sm" asChild><Link href="/company/profile">Get verified</Link></Button>
    </div>
  );
}
