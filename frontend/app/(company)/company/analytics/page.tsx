'use client';

import { useMemo } from 'react';
import {
  Users,
  Eye,
  Star,
  CheckCircle2,
  Target,
  TrendingUp,
  TrendingDown,
  Trophy,
  Briefcase,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Loader } from '@/components/ui/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { SimpleLineChart, SimpleBarChart } from '@/components/shared/charts';
import { useCompanyAnalytics, useCompanyApplicants } from '@/hooks/use-company';
import type { Application } from '@/types';

const DAY = 86_400_000;
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CompanyAnalyticsPage() {
  const { data, isLoading } = useCompanyAnalytics();
  const { data: applicants } = useCompanyApplicants();

  // Flatten the applicant board into a single list (real apply dates).
  const apps = useMemo(() => {
    const board = applicants?.board ?? {};
    return Object.values(board).flat() as Application[];
  }, [applicants]);

  // Applications per day for the last 14 days.
  const overTime = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const buckets = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today.getTime() - (13 - i) * DAY);
      return { time: d.getTime(), name: `${d.getDate()}/${d.getMonth() + 1}`, value: 0 };
    });
    for (const a of apps) {
      const d = new Date(a.createdAt);
      d.setHours(0, 0, 0, 0);
      const b = buckets.find((x) => x.time === d.getTime());
      if (b) b.value += 1;
    }
    return buckets.map(({ name, value }) => ({ name, value }));
  }, [apps]);

  // Applications by weekday (most active day).
  const byWeekday = useMemo(() => {
    const counts = new Array(7).fill(0);
    for (const a of apps) counts[new Date(a.createdAt).getDay()] += 1;
    return WEEKDAYS.map((name, i) => ({ name, value: counts[i] }));
  }, [apps]);

  const mostActive = useMemo(
    () => byWeekday.reduce((best, d) => (d.value > best.value ? d : best), byWeekday[0]),
    [byWeekday]
  );

  // Real trend: applications in the last 7 days vs the 7 days before.
  const trend = useMemo(() => {
    const now = Date.now();
    const last7 = apps.filter((a) => now - new Date(a.createdAt).getTime() <= 7 * DAY).length;
    const prev7 = apps.filter((a) => {
      const t = now - new Date(a.createdAt).getTime();
      return t > 7 * DAY && t <= 14 * DAY;
    }).length;
    if (!prev7) return null;
    return Math.round(((last7 - prev7) / prev7) * 100);
  }, [apps]);

  if (isLoading) return <Loader label="Loading analytics…" />;

  const f = data?.applicationFunnel ?? {};
  const pending = f.pending ?? 0;
  const shortlisted = f.shortlisted ?? 0;
  const hired = f.hired ?? 0;
  const rejected = f.rejected ?? 0;
  const totalApps = pending + shortlisted + hired + rejected;
  const s = data?.internships;
  const hireRate = totalApps ? Math.round((hired / totalApps) * 100) : 0;
  const top = data?.topInternships ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="How your postings and hiring are performing." />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total applications" value={totalApps} trend={trend} hint="last 7 days" tint="text-indigo-600" />
        <StatCard icon={Eye} label="Total views" value={s?.totalViews ?? 0} hint={`across ${s?.total ?? 0} internships`} tint="text-sky-600" />
        <StatCard icon={Star} label="Shortlisted" value={shortlisted + hired} hint="reached shortlist" tint="text-amber-600" />
        <StatCard icon={CheckCircle2} label="Hired" value={hired} hint={`${hireRate}% hire rate`} tint="text-emerald-600" />
      </div>

      {/* Trend + weekday */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Applications over time</CardTitle>
            <p className="text-sm text-muted-foreground">Last 14 days</p>
          </CardHeader>
          <CardContent>
            {apps.length === 0 ? (
              <EmptyState title="No applications yet" description="Trends appear as students apply." icon={Users} />
            ) : (
              <SimpleLineChart data={overTime} height={260} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most active day</CardTitle>
            <p className="text-sm text-muted-foreground">
              {mostActive?.value ? `${mostActive.name} leads with ${mostActive.value}` : 'No data yet'}
            </p>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={byWeekday} height={260} />
          </CardContent>
        </Card>
      </div>

      {/* Hire-rate gauge + funnel breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Hire rate</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <Gauge value={hireRate} />
            <p className="mt-2 text-sm text-muted-foreground">{hired} of {totalApps} applicants hired</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Application funnel</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <FunnelRow label="Pending review" value={pending} total={totalApps} color="#6366f1" />
            <FunnelRow label="Shortlisted" value={shortlisted} total={totalApps} color="#f59e0b" />
            <FunnelRow label="Hired" value={hired} total={totalApps} color="#22c55e" />
            <FunnelRow label="Rejected" value={rejected} total={totalApps} color="#ef4444" />
            <div className="flex items-center justify-between border-t pt-3 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground"><Target className="h-4 w-4" /> Avg. match score</span>
              <span className="font-semibold">{data?.averageMatchScore ?? 0}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top internships table */}
      <Card>
        <CardHeader><CardTitle className="text-base">Top internships</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="hidden grid-cols-[auto_1fr_auto_auto] gap-4 border-b px-5 py-2 text-xs font-medium text-muted-foreground sm:grid">
            <span>#</span>
            <span>Internship</span>
            <span className="text-right">Views</span>
            <span className="text-right">Applicants</span>
          </div>
          {top.length === 0 ? (
            <div className="p-5"><EmptyState title="No internships yet" description="Post an internship to see rankings." icon={Briefcase} /></div>
          ) : (
            <div className="divide-y">
              {top.map((i, idx) => (
                <div key={i._id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3 sm:grid-cols-[auto_1fr_auto_auto]">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${idx === 0 ? 'bg-amber-100 text-amber-700' : 'bg-muted text-muted-foreground'}`}>
                    {idx === 0 ? <Trophy className="h-3.5 w-3.5" /> : idx + 1}
                  </span>
                  <span className="min-w-0 truncate font-medium">{i.title}</span>
                  <span className="hidden items-center justify-end gap-1 text-sm text-muted-foreground sm:flex">
                    <Eye className="h-4 w-4" /> {i.stats?.views ?? 0}
                  </span>
                  <span className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" /> {i.stats?.applications ?? 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  hint,
  tint,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  trend?: number | null;
  hint?: string;
  tint?: string;
}) {
  const up = (trend ?? 0) >= 0;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <Icon className={`h-4 w-4 ${tint ?? 'text-muted-foreground'}`} />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value.toLocaleString('en-IN')}</span>
          {typeof trend === 'number' && (
            <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${up ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function FunnelRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          {label}
        </span>
        <span className="font-medium">{value} <span className="text-xs text-muted-foreground">({pct}%)</span></span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

/** Semicircle progress gauge (0–100). */
function Gauge({ value }: { value: number }) {
  const arc = Math.PI * 70; // length of the semicircle path
  const offset = arc * (1 - Math.min(100, Math.max(0, value)) / 100);
  return (
    <svg viewBox="0 0 180 104" className="w-full max-w-[220px]">
      <path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="hsl(var(--muted))" strokeWidth="14" strokeLinecap="round" />
      <path
        d="M20 90 A70 70 0 0 1 160 90"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={arc}
        strokeDashoffset={offset}
      />
      <text x="90" y="84" textAnchor="middle" className="fill-foreground text-2xl font-bold">{value}%</text>
    </svg>
  );
}
