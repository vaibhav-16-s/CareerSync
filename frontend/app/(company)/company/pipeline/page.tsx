'use client';

import Link from 'next/link';
import {
  Inbox,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Users,
  FileCheck2,
  FilePlus2,
  ShieldCheck,
  Rocket,
  Search,
  ClipboardList,
  Handshake,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { useCompanyAnalytics } from '@/hooks/use-company';

const HIRING_STEPS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: FilePlus2, title: 'Post an internship', desc: 'Create and publish your internship with role, required skills, stipend, and eligibility.' },
  { icon: ShieldCheck, title: 'Get your company verified', desc: 'Submit your registration document so your company is verified and trusted by students.' },
  { icon: Rocket, title: 'Internship goes live', desc: 'Once verified, your listing appears in student search and AI matching results.' },
  { icon: Search, title: 'Students discover & apply', desc: 'Matched students find your internship and submit applications with their profiles.' },
  { icon: ClipboardList, title: 'Review applicants', desc: 'Open the Applicants board to view each candidate’s full profile, skills, and resume.' },
  { icon: Star, title: 'Shortlist candidates', desc: 'Move promising applicants to Shortlisted — they are notified they are under review.' },
  { icon: Handshake, title: 'Evaluate & decide', desc: 'Compare match scores, interview if needed, and pick the best fit for the role.' },
  { icon: CheckCircle2, title: 'Hire or reject', desc: 'Hire your chosen candidate (offer) or reject others. Rejected candidates can be reconsidered.' },
];

export default function CompanyPipelinePage() {
  const { data, isLoading } = useCompanyAnalytics();
  if (isLoading) return <Loader label="Loading hiring pipeline…" />;

  const f = data?.applicationFunnel ?? {};
  const pending = f.pending ?? 0;
  const shortlisted = f.shortlisted ?? 0;
  const hired = f.hired ?? 0;
  const rejected = f.rejected ?? 0;
  const total = pending + shortlisted + hired + rejected;

  const stages: Stage[] = [
    { key: 'applied', label: 'Applied', value: total, icon: Inbox, color: '#6366f1', hint: 'Everyone who applied' },
    { key: 'shortlisted', label: 'Shortlisted', value: shortlisted, icon: Star, color: '#f59e0b', hint: 'Under review' },
    { key: 'hired', label: 'Hired', value: hired, icon: CheckCircle2, color: '#22c55e', hint: 'Offer accepted' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hiring Pipeline"
        description="Track how candidates flow through each hiring stage."
        action={
          <Button variant="outline" asChild>
            <Link href="/company/applicants">Open board <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        }
      />

      {total === 0 ? (
        <EmptyState
          title="No candidates in the pipeline yet"
          description="As students apply, you'll see them flow through your hiring stages here."
          icon={Users}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hiring flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
              {stages.map((s, i) => (
                <FlowStep key={s.key} stage={s} connector={i < stages.length - 1} />
              ))}
            </div>

            {/* Exit branch */}
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm">
              <XCircle className="h-5 w-5 shrink-0 text-red-500" />
              <span className="font-medium text-red-600 dark:text-red-400">{rejected}</span>
              <span className="text-muted-foreground">
                candidate{rejected === 1 ? '' : 's'} rejected / not moving forward
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How hiring works — 8 steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How hiring works — step by step</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative space-y-6">
            {HIRING_STEPS.map((step, i) => {
              const Icon = step.icon;
              const last = i === HIRING_STEPS.length - 1;
              return (
                <li key={step.title} className="relative flex gap-4">
                  {/* Connector line */}
                  {!last && <span className="absolute left-5 top-11 h-[calc(100%-0.5rem)] w-px bg-border" />}
                  {/* Number + icon */}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="flex items-center gap-2 font-medium">
                      <Icon className="h-4 w-4 text-primary" /> {step.title}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      {/* Terms & conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCheck2 className="h-4 w-4 text-primary" /> Terms &amp; conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Candidates move through stages in order: <span className="font-medium text-foreground">Applied → Shortlisted → Hired</span>. A candidate can be rejected at any stage.</li>
            <li>Shortlisting a candidate notifies them that they are under review; it is not a job offer.</li>
            <li>Marking a candidate as <span className="font-medium text-foreground">Hired</span> is final and is treated as an offer of internship.</li>
            <li>Rejected candidates can be reconsidered and moved back to Shortlisted; a hired candidate cannot be un-hired.</li>
            <li>Only verified companies may publish internships and progress candidates through the pipeline.</li>
            <li>Candidate data shown here is provided by the applicant and must be used only for this hiring process.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

interface Stage {
  key: string;
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  hint: string;
}

function FlowStep({ stage, connector }: { stage: Stage; connector: boolean }) {
  const { icon: Icon, label, value, color, hint } = stage;
  const active = value > 0;
  return (
    <>
      <div
        className="flex flex-1 flex-col items-center rounded-xl border p-4 text-center transition-colors"
        style={{ borderColor: active ? color : undefined, backgroundColor: active ? `${color}14` : undefined }}
      >
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: active ? color : '#cbd5e1' }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <p className="mt-2 text-2xl font-bold" style={{ color: active ? color : undefined }}>{value}</p>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      {connector && (
        <div className="flex shrink-0 items-center justify-center px-1 text-muted-foreground">
          <ArrowRight className="hidden h-5 w-5 md:block" />
          <ArrowRight className="h-5 w-5 rotate-90 md:hidden" />
        </div>
      )}
    </>
  );
}
