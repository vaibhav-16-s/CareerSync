'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateInternship } from '@/hooks/use-internships';
import { Proficiency } from '@/types';

const inputCls =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

const normId = (s: string) => s.toLowerCase().replace(/[.\s_-]+/g, '');

export default function PostInternshipPage() {
  const router = useRouter();
  const create = useCreateInternship();

  const [f, setF] = useState({
    title: '',
    role: '',
    description: '',
    skills: '',
    city: '',
    remoteOk: false,
    stipend: '',
    period: 'month',
    duration: '',
    openings: '1',
    deadline: '',
    minYear: '',
    maxYear: '',
    status: 'active',
  });

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredSkills = f.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({ skillId: normId(name), name, weight: 1, minProficiency: Proficiency.BEGINNER }));

    if (!f.title.trim() || f.description.trim().length < 20 || requiredSkills.length === 0) {
      return;
    }

    create.mutate(
      {
        title: f.title.trim(),
        role: f.role.trim() || undefined,
        description: f.description.trim(),
        requiredSkills,
        location: { city: f.city.trim() || undefined, remoteOk: f.remoteOk },
        stipend: { amount: Number(f.stipend) || 0, currency: 'INR', period: f.period },
        duration: f.duration.trim() || undefined,
        openings: Number(f.openings) || 1,
        deadline: f.deadline || undefined,
        eligibility: {
          minYear: f.minYear ? Number(f.minYear) : undefined,
          maxYear: f.maxYear ? Number(f.maxYear) : undefined,
        },
        status: f.status,
      },
      { onSuccess: () => router.push('/company/internships') }
    );
  };

  return (
    <div>
      <PageHeader title="Post an internship" description="Fill in the details — verified companies go live instantly." />

      <form onSubmit={submit} className="mt-6 space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Basics</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Title *"><Input value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="Frontend Developer Intern" /></Field>
            <Field label="Role"><Input value={f.role} onChange={(e) => set('role', e.target.value)} placeholder="Frontend" /></Field>
            <Field label="Required skills * (comma-separated)"><Input value={f.skills} onChange={(e) => set('skills', e.target.value)} placeholder="react, node, mongodb" /></Field>
            <Field label="Description *" full>
              <textarea
                value={f.description}
                onChange={(e) => set('description', e.target.value)}
                rows={5}
                placeholder="What the intern will do, team, expectations… (min 20 chars)"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="City"><Input value={f.city} onChange={(e) => set('city', e.target.value)} placeholder="Bengaluru" /></Field>
            <Field label="Remote">
              <label className="flex h-9 items-center gap-2 text-sm">
                <input type="checkbox" checked={f.remoteOk} onChange={(e) => set('remoteOk', e.target.checked)} className="h-4 w-4 rounded border-input" />
                Remote-friendly
              </label>
            </Field>
            <Field label="Stipend (₹ / period)">
              <div className="flex gap-2">
                <Input type="number" min={0} value={f.stipend} onChange={(e) => set('stipend', e.target.value)} placeholder="10000" />
                <select value={f.period} onChange={(e) => set('period', e.target.value)} className={inputCls} aria-label="Stipend period">
                  <option value="month">/month</option>
                  <option value="week">/week</option>
                  <option value="total">total</option>
                </select>
              </div>
            </Field>
            <Field label="Duration"><Input value={f.duration} onChange={(e) => set('duration', e.target.value)} placeholder="3 months" /></Field>
            <Field label="Openings"><Input type="number" min={1} value={f.openings} onChange={(e) => set('openings', e.target.value)} /></Field>
            <Field label="Deadline"><Input type="date" value={f.deadline} onChange={(e) => set('deadline', e.target.value)} /></Field>
            <Field label="Min year"><Input type="number" min={1} max={6} value={f.minYear} onChange={(e) => set('minYear', e.target.value)} placeholder="1" /></Field>
            <Field label="Max year"><Input type="number" min={1} max={6} value={f.maxYear} onChange={(e) => set('maxYear', e.target.value)} placeholder="4" /></Field>
            <Field label="Publish as">
              <select value={f.status} onChange={(e) => set('status', e.target.value)} className={inputCls} aria-label="Status">
                <option value="active">Active (live now)</option>
                <option value="draft">Draft</option>
              </select>
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Posting…' : 'Post internship'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2 lg:col-span-3' : ''}>
      <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
