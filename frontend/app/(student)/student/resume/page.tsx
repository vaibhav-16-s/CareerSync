'use client';

import Link from 'next/link';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  FileText,
  Sparkles,
  ShieldCheck,
  Target,
  SpellCheck2,
  Braces,
  ArrowRight,
  Trophy,
  UploadCloud,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { FileUpload } from '@/components/shared/file-upload';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useResumeDashboard, useUploadResumeAnalysis } from '@/hooks/use-resume';
import type { CategoryScore, Priority, ResumeSuggestion } from '@/types';

const PRIORITY_STYLES: Record<Priority, string> = {
  critical: 'bg-red-500/10 text-red-600 border-red-500/30',
  high: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
  medium: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  low: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
};

function scoreColor(n: number) {
  return n >= 75 ? 'text-emerald-500' : n >= 50 ? 'text-amber-500' : 'text-red-500';
}
function barColor(n: number) {
  return n >= 75 ? 'bg-emerald-500' : n >= 50 ? 'bg-amber-500' : 'bg-red-500';
}

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative h-32 w-32">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} strokeWidth="12" className="fill-none stroke-muted" />
        <circle
          cx="60"
          cy="60"
          r={r}
          strokeWidth="12"
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="fill-none transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className="h-4 w-4" />
            {label}
          </div>
          <span className={cn('text-lg font-bold', scoreColor(value))}>{value}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className={cn('h-full rounded-full transition-all', barColor(value))} style={{ width: `${value}%` }} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResumePage() {
  const { data, isLoading } = useResumeDashboard();
  const upload = useUploadResumeAnalysis();

  if (isLoading) return <Loader label="Loading your resume intelligence…" />;

  const latest = data?.latest;
  const scores = latest?.scores;

  const radarData =
    latest?.categories
      ?.filter((c) => ['ats', 'technicalSkills', 'keywords', 'grammar', 'structure', 'formatting'].includes(c.key))
      .map((c) => ({ axis: c.label.replace('Resume ', ''), score: c.score })) ?? [];

  const historyData = (data?.history ?? []).map((h) => ({ name: `v${h.version}`, Overall: h.overall, ATS: h.ats }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume Intelligence"
        description="Upload your resume for an instant ATS-grade review, scores and actionable fixes."
        action={
          latest ? (
            <Button asChild variant="outline">
              <Link href={`/student/resume/${latest.id}`}>
                Full report <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          ) : undefined
        }
      />

      {/* Don't have a resume? Build one */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">Don&apos;t have a resume yet?</p>
              <p className="text-sm text-muted-foreground">
                Answer a few questions — we pre-fill from your profile — and generate a clean PDF resume in minutes.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/student/resume/build">
              Build my resume <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Upload / re-analyze */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UploadCloud className="h-4 w-4 text-primary" />
            {latest ? 'Analyze a new version' : 'Upload your resume'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            accept=".pdf,.docx"
            maxSizeMb={5}
            uploading={upload.isPending}
            onUpload={(file) => upload.mutate(file)}
            label={upload.isPending ? 'Analyzing your resume…' : 'Upload PDF or DOCX'}
            hint="We extract the text, score 17 dimensions and generate fixes — instantly."
          />
        </CardContent>
      </Card>

      {!latest ? (
        <EmptyState
          title="No analysis yet"
          description="Upload a resume above to get your ATS score, skill breakdown and improvement plan."
          icon={FileText}
        />
      ) : (
        <>
          {/* Hero scores */}
          <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
            <Card>
              <CardContent className="flex flex-col items-center gap-2 p-6">
                <ScoreRing score={scores?.overall ?? 0} />
                <Badge variant="secondary" className="capitalize">{latest.strength} resume</Badge>
                <p className="text-xs text-muted-foreground">
                  Internship readiness: <span className="font-semibold">{latest.readinessScore ?? 0}%</span>
                </p>
                {data && data.totalVersions > 1 && (
                  <p className={cn('text-xs font-medium', data.improvement >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                    {data.improvement >= 0 ? '▲' : '▼'} {Math.abs(data.improvement)} pts since v1
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MiniStat icon={ShieldCheck} label="ATS" value={scores?.ats ?? 0} />
              <MiniStat icon={Braces} label="Skills" value={scores?.skill ?? 0} />
              <MiniStat icon={Target} label="Keywords" value={scores?.keyword ?? 0} />
              <MiniStat icon={SpellCheck2} label="Grammar" value={scores?.grammar ?? 0} />
              <div className="sm:col-span-2 xl:col-span-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Engine</p>
                    <Badge variant={latest.engine === 'ai-enhanced' ? 'success' : 'outline'}>
                      {latest.engine === 'ai-enhanced' ? '✨ AI-enhanced' : 'Rule-based analysis'}
                    </Badge>
                    {latest.engine !== 'ai-enhanced' && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Add a GEMINI_API_KEY to unlock AI narratives & the full rewrite.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Dimension radar</CardTitle></CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="75%">
                    <PolarGrid className="stroke-muted" />
                    <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
                    <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Score history</CardTitle></CardHeader>
              <CardContent className="h-72">
                {historyData.length > 1 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="Overall" stroke="#6366f1" strokeWidth={2} />
                      <Line type="monotone" dataKey="ATS" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                    Upload another version to see your progress over time.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Category breakdown */}
          <Card>
            <CardHeader><CardTitle className="text-base">Category breakdown</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {latest.categories?.map((c) => (
                <CategoryBar key={c.key} c={c} />
              ))}
            </CardContent>
          </Card>

          {/* Suggestions */}
          {latest.suggestions && latest.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" /> Priority improvements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {latest.suggestions.map((s, i) => (
                  <SuggestionRow key={i} s={s} />
                ))}
              </CardContent>
            </Card>
          )}

          {/* History */}
          {data && data.totalVersions > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Trophy className="h-4 w-4 text-primary" /> Version history
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.history
                  .slice()
                  .reverse()
                  .map((h) => (
                    <div key={h.version} className="flex items-center justify-between rounded-md border p-3 text-sm">
                      <span className="font-medium">Version {h.version}</span>
                      <span className="text-xs text-muted-foreground">{new Date(h.date).toLocaleDateString()}</span>
                      <span className={cn('font-semibold', scoreColor(h.overall))}>{h.overall}/100</span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function CategoryBar({ c }: { c: CategoryScore }) {
  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{c.label}</span>
        <span className={cn('text-sm font-semibold', scoreColor(c.score))}>{c.score}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full', barColor(c.score))} style={{ width: `${c.score}%` }} />
      </div>
      {c.explanation && <p className="mt-1.5 text-xs text-muted-foreground">{c.explanation}</p>}
    </div>
  );
}

function SuggestionRow({ s }: { s: ResumeSuggestion }) {
  return (
    <div className={cn('rounded-lg border p-4', PRIORITY_STYLES[s.priority])}>
      <div className="flex items-center justify-between">
        <p className="font-medium text-foreground">{s.title}</p>
        <Badge variant="outline" className="capitalize">{s.priority}</Badge>
      </div>
      {s.why && <p className="mt-1 text-sm text-muted-foreground">{s.why}</p>}
      <p className="mt-1 text-sm text-foreground">
        <span className="font-medium">How: </span>
        {s.how}
      </p>
      {s.expectedGain > 0 && (
        <p className="mt-1 text-xs text-muted-foreground">Expected gain: +{s.expectedGain} pts</p>
      )}
    </div>
  );
}
