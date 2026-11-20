'use client';

import { useEffect, useState } from 'react';
import { Plus, X, Award, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useStudentProfile, useUpdateStudentProfile } from '@/hooks/use-student';
import type { Certification } from '@/types';

export default function CertificationsPage() {
  const { data, isLoading } = useStudentProfile();
  const update = useUpdateStudentProfile();

  const [certs, setCerts] = useState<Certification[]>([]);
  const [draft, setDraft] = useState({ name: '', issuer: '', url: '' });

  useEffect(() => {
    if (data?.certifications) setCerts(data.certifications);
  }, [data]);

  if (isLoading) return <Loader label="Loading your certifications…" />;

  const add = () => {
    if (!draft.name.trim()) return;
    setCerts((c) => [
      ...c,
      {
        name: draft.name.trim(),
        issuer: draft.issuer.trim() || undefined,
        url: draft.url.trim() || undefined,
      },
    ]);
    setDraft({ name: '', issuer: '', url: '' });
  };

  const remove = (i: number) => setCerts((c) => c.filter((_, idx) => idx !== i));
  const save = () => update.mutate({ certifications: certs });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certifications"
        description="List courses and certifications you've earned."
        action={
          <Button onClick={save} disabled={update.isPending}>
            {update.isPending ? 'Saving…' : 'Save'}
          </Button>
        }
      />

      <Card>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
          <div>
            <Label className="mb-1.5 block">Name</Label>
            <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Meta Front-End" />
          </div>
          <div>
            <Label className="mb-1.5 block">Issuer</Label>
            <Input value={draft.issuer} onChange={(e) => setDraft({ ...draft, issuer: e.target.value })} placeholder="Coursera" />
          </div>
          <div>
            <Label className="mb-1.5 block">URL (optional)</Label>
            <Input value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="https://…" />
          </div>
          <div>
            <Button type="button" variant="secondary" onClick={add}>
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {certs.length === 0 ? (
        <EmptyState title="No certifications yet" description="Add certifications to boost your credibility." icon={Award} />
      ) : (
        <div className="space-y-2">
          {certs.map((c, i) => (
            <Card key={`${c.name}-${i}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{c.name}</p>
                  {c.issuer && <p className="text-sm text-muted-foreground">{c.issuer}</p>}
                </div>
                <div className="flex items-center gap-3">
                  {c.url && (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <button
                    onClick={() => remove(i)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${c.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
