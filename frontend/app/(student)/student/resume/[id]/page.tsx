'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  ListChecks,
  Braces,
  Target,
  SpellCheck2,
  Wand2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useResumeVersion, useRewriteResume } from '@/hooks/use-resume';
import type { Priority } from '@/types';

const PRIORITY_STYLES: Record<Priority, string> = {
  critical: 'bg-red-500/10 text-red-600',
  high: 'bg-orange-500/10 text-orange-600',
  medium: 'bg-amber-500/10 text-amber-600',
  low: 'bg-emerald-500/10 text-emerald-600',
};
const scoreColor = (n: number) => (n >= 75 ? 'text-emerald-500' : n >= 50 ? 'text-amber-500' : 'text-red-500');

export default function ResumeReportPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading } = useResumeVersion(id);
  const rewrite = useRewriteResume();

  if (isLoading) return <Loader label="Loading report…" />;
  if (!data?.report) {
    return (
      <div className="space-y-4">
        <BackLink />
        <p className="text-sm text-muted-foreground">Report not available for this version.</p>
      </div>
    );
  }

  const r = data.report;
  const rw = data.rewrite as Record<string, unknown> | undefined;

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title={`Resume Report — v${data.version}`}
        description={`Overall ${r.overallScore}/100 · ${r.strength} · ${r.meta.wordCount} words${r.meta.pageCount ? ` · ${r.meta.pageCount} page(s)` : ''}`}
        action={
          <Button onClick={() => rewrite.mutate(id)} disabled={rewrite.isPending}>
            <Wand2 className="mr-1 h-4 w-4" />
            {rewrite.isPending ? 'Rewriting…' : 'Improve my resume'}
          </Button>
        }
      />

      {/* Rewrite output */}
      {(rewrite.data || rw) && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-primary" /> AI improvement kit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <RewriteView data={(rewrite.data as Record<string, unknown>) ?? rw!} />
          </CardContent>
        </Card>
      )}

      {/* ATS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> ATS Compatibility</span>
            <span className={cn('text-lg font-bold', scoreColor(r.ats.score))}>{r.ats.score}/100</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {r.ats.checks.map((c) => (
            <div key={c.key} className="flex items-start gap-2 rounded-md border p-3 text-sm">
              {c.passed ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              )}
              <div>
                <p className="font-medium">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><ListChecks className="h-4 w-4 text-primary" /> Sections</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {r.sections.map((s) => (
            <span
              key={s.key}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm',
                s.present ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600' : 'border-red-500/30 bg-red-500/10 text-red-600'
              )}
            >
              {s.present ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
              {s.label}
            </span>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Braces className="h-4 w-4 text-primary" /> Technical Skills</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(['frontend', 'backend', 'database', 'cloud', 'devops', 'languages', 'frameworks', 'tools'] as const).map((cat) =>
            r.skills[cat]?.length ? <SkillGroup key={cat} title={cat} items={r.skills[cat]} /> : null
          )}
          {r.skills.missing.length > 0 && <SkillGroup title="missing (in demand)" items={r.skills.missing} tone="red" />}
          {r.skills.trending.length > 0 && <SkillGroup title="trending to learn" items={r.skills.trending} tone="amber" />}
        </CardContent>
      </Card>

      {/* Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Keyword Optimization</span>
            <span className="text-sm text-muted-foreground">density {r.keywords.density}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <KeywordGroup title="Matched" items={r.keywords.matched} tone="emerald" />
          <KeywordGroup title="Missing" items={r.keywords.missing} tone="red" />
          <KeywordGroup title="Weak (mentioned once)" items={r.keywords.weak} tone="amber" />
          <KeywordGroup title="Recommended" items={r.keywords.recommended} tone="indigo" />
        </CardContent>
      </Card>

      {/* Grammar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2"><SpellCheck2 className="h-4 w-4 text-primary" /> Grammar & Writing</span>
            <span className={cn('text-lg font-bold', scoreColor(r.grammar.score))}>{r.grammar.score}/100</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>Action verbs: <b className="text-foreground">{r.grammar.actionVerbCount}</b></span>
            <span>Passive voice: <b className="text-foreground">{r.grammar.passiveVoiceCount}</b></span>
            <span>Long paragraphs: <b className="text-foreground">{r.grammar.longParagraphs}</b></span>
          </div>
          {r.grammar.issues.map((i, idx) => (
            <div key={idx} className="rounded-md border p-3">
              <p className="font-medium capitalize">{i.type.replace('_', ' ')}: <span className="font-normal">{i.text}</span></p>
              <p className="text-xs text-muted-foreground">{i.suggestion}</p>
            </div>
          ))}
          {r.grammar.repeatedWords.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Overused: {r.grammar.repeatedWords.map((w) => `${w.word} (${w.count})`).join(', ')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Full category breakdown with suggestions */}
      <Card>
        <CardHeader><CardTitle className="text-base">All categories</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {r.categories.map((c) => (
            <div key={c.key} className="rounded-md border p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{c.label}</span>
                <div className="flex items-center gap-2">
                  <Badge className={cn('capitalize', PRIORITY_STYLES[c.priority])} variant="outline">{c.priority}</Badge>
                  <span className={cn('font-semibold', scoreColor(c.score))}>{c.score}</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{c.explanation}</p>
              {c.suggestions.map((s, i) => (
                <p key={i} className="mt-1 text-sm">• {s}</p>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function BackLink() {
  return (
    <Link href="/student/resume" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="h-4 w-4" /> Back to Resume Intelligence
    </Link>
  );
}

function SkillGroup({ title, items, tone }: { title: string; items: string[]; tone?: 'red' | 'amber' }) {
  const chip =
    tone === 'red' ? 'bg-red-500/10 text-red-600' : tone === 'amber' ? 'bg-amber-500/10 text-amber-600' : 'bg-muted';
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium capitalize text-muted-foreground">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => (
          <span key={s} className={cn('rounded px-2 py-0.5 text-xs', chip)}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function KeywordGroup({ title, items, tone }: { title: string; items: string[]; tone: 'emerald' | 'red' | 'amber' | 'indigo' }) {
  const map = {
    emerald: 'bg-emerald-500/10 text-emerald-600',
    red: 'bg-red-500/10 text-red-600',
    amber: 'bg-amber-500/10 text-amber-600',
    indigo: 'bg-indigo-500/10 text-indigo-600',
  };
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{title} ({items.length})</p>
      <div className="flex flex-wrap gap-1.5">
        {items.length ? (
          items.map((s) => <span key={s} className={cn('rounded px-2 py-0.5 text-xs', map[tone])}>{s}</span>)
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </div>
    </div>
  );
}

function RewriteView({ data }: { data: Record<string, unknown> }) {
  const str = (k: string) => (typeof data[k] === 'string' ? (data[k] as string) : null);
  const arr = (k: string) => (Array.isArray(data[k]) ? (data[k] as unknown[]) : null);

  return (
    <div className="space-y-3">
      {str('summary') && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Suggested summary</p>
          <p className="rounded-md bg-background p-3">{str('summary')}</p>
        </div>
      )}
      {str('skillsSection') && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Skills section</p>
          <p className="rounded-md bg-background p-3">{str('skillsSection')}</p>
        </div>
      )}
      {arr('bulletRewrites') && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Bullet rewrites</p>
          <div className="space-y-2">
            {(arr('bulletRewrites') as { before?: string; after?: string }[]).map((b, i) => (
              <div key={i} className="rounded-md bg-background p-3 text-sm">
                <p className="text-muted-foreground line-through">{b.before}</p>
                <p className="font-medium">{b.after}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {arr('replaceWeakPhrases') && (arr('replaceWeakPhrases') as { before?: string; after?: string }[]).length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Replace weak phrases</p>
          {(arr('replaceWeakPhrases') as { before?: string; after?: string }[]).map((b, i) => (
            <p key={i} className="text-sm">• <b>{b.before}</b> → {b.after}</p>
          ))}
        </div>
      )}
      {arr('strongVerbs') && (
        <p className="text-sm"><b>Strong verbs:</b> {(arr('strongVerbs') as string[]).join(', ')}</p>
      )}
      {arr('quantifyTips') && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Quantify your impact</p>
          {(arr('quantifyTips') as string[]).map((t, i) => <p key={i} className="text-sm">• {t}</p>)}
        </div>
      )}
      {arr('addKeywords') && (arr('addKeywords') as string[]).length > 0 && (
        <p className="text-sm"><b>Add keywords:</b> {(arr('addKeywords') as string[]).join(', ')}</p>
      )}
      {arr('achievements') && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Achievement bullets</p>
          {(arr('achievements') as string[]).map((t, i) => <p key={i} className="text-sm">• {t}</p>)}
        </div>
      )}
    </div>
  );
}
