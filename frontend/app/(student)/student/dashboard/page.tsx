'use client';

import Link from 'next/link';
import {
  Briefcase,
  Bookmark,
  Sparkles,
  FileText,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { EmptyState } from '@/components/shared/empty-state';
import { PipelineFunnel } from '@/components/shared/charts';
import { MatchScoreBadge } from '@/components/shared/status-badge';
import { useStudentDashboard } from '@/hooks/use-student';
import { useRecommendations } from '@/hooks/use-ai';
import { useAuthStore } from '@/store/auth.store';
import { pct } from '@/lib/utils';
import { ApplicationStatus } from '@/types';

export default function StudentDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useStudentDashboard();
  const { data: recs, isLoading: recsLoading } = useRecommendations(5);

  if (isLoading) return <Loader label="Loading your dashboard…" />;

  const pipeline = data?.applicationPipeline ?? {};
  const totalApplications = Object.values(pipeline).reduce((a, b) => a + b, 0);

  const funnelData = [
    { name: 'Pending', value: pipeline[ApplicationStatus.PENDING] ?? 0 },
    { name: 'Shortlisted', value: pipeline[ApplicationStatus.SHORTLISTED] ?? 0 },
    { name: 'Hired', value: pipeline[ApplicationStatus.HIRED] ?? 0 },
    { name: 'Rejected', value: pipeline[ApplicationStatus.REJECTED] ?? 0 },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome${user ? `, ${user.email.split('@')[0]}` : ''}!`}
        description="Here's what's happening with your internship search."
        action={
          <Button asChild>
            <Link href="/student/search">
              Find internships <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Applications" value={totalApplications} icon={Briefcase} />
        <StatCard label="Saved" value={data?.savedCount ?? 0} icon={Bookmark} />
        <StatCard label="Skills added" value={data?.skillsCount ?? 0} icon={Sparkles} />
        <StatCard
          label="Active internships"
          value={data?.activeInternships ?? 0}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile completeness */}
        <Card>
          <CardHeader>
            <CardTitle>Profile strength</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">
                  {pct(data?.profileCompleteness ?? 0)}
                </span>
                <span className="text-sm text-muted-foreground">complete</span>
              </div>
              <Progress value={data?.profileCompleteness ?? 0} />
            </div>
            <ul className="space-y-2 text-sm">
              <ChecklistRow done={(data?.skillsCount ?? 0) > 0} label="Add your skills" href="/student/skills" />
              <ChecklistRow done={Boolean(data?.hasResume)} label="Upload your resume" href="/student/resume" />
              <ChecklistRow
                done={(data?.profileCompleteness ?? 0) >= 80}
                label="Complete your profile"
                href="/student/profile"
              />
            </ul>
          </CardContent>
        </Card>

        {/* Application funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Application pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            {totalApplications === 0 ? (
              <EmptyState
                title="No applications yet"
                description="Start applying to see your pipeline here."
                icon={Briefcase}
              />
            ) : (
              <PipelineFunnel data={funnelData} height={240} />
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Recommended for you</CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            {recsLoading ? (
              <Loader label="Finding matches…" />
            ) : !recs || recs.length === 0 ? (
              <EmptyState
                title="No matches yet"
                description="Add skills & a resume to unlock recommendations."
                icon={Sparkles}
              />
            ) : (
              recs.map((rec) => {
                const internship = rec.internship;
                return (
                  <Link
                    key={internship._id}
                    href={`/student/internships/${internship._id}`}
                    className="flex items-center justify-between gap-2 rounded-lg border p-3 transition-colors hover:bg-accent"
                  >
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-medium">
                        {internship.title}
                      </p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {typeof internship.companyId === 'object'
                          ? internship.companyId.name
                          : 'Company'}
                      </p>
                    </div>
                    <MatchScoreBadge score={rec.score} />
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function ChecklistRow({
  done,
  label,
  href,
}: {
  done: boolean;
  label: string;
  href: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <CheckCircle2
          className={done ? 'h-4 w-4 text-green-500' : 'h-4 w-4 text-muted-foreground/40'}
        />
        <span className={done ? 'line-through' : ''}>{label}</span>
      </Link>
    </li>
  );
}
