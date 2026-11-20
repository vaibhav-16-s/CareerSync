'use client';

import { useEffect, useState } from 'react';
import { Plus, X, FolderGit2, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useStudentProfile, useUpdateStudentProfile } from '@/hooks/use-student';
import type { Project } from '@/types';

export default function ProjectsPage() {
  const { data, isLoading } = useStudentProfile();
  const update = useUpdateStudentProfile();

  const [projects, setProjects] = useState<Project[]>([]);
  const [draft, setDraft] = useState({ title: '', description: '', techStack: '', link: '' });

  useEffect(() => {
    if (data?.projects) setProjects(data.projects);
  }, [data]);

  if (isLoading) return <Loader label="Loading your projects…" />;

  const add = () => {
    if (!draft.title.trim()) return;
    setProjects((p) => [
      ...p,
      {
        title: draft.title.trim(),
        description: draft.description.trim() || undefined,
        techStack: draft.techStack
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
        link: draft.link.trim() || undefined,
      },
    ]);
    setDraft({ title: '', description: '', techStack: '', link: '' });
  };

  const remove = (i: number) => setProjects((p) => p.filter((_, idx) => idx !== i));
  const save = () => update.mutate({ projects });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Projects showcase real skills — they boost your match score, especially for early-year students."
        action={
          <Button onClick={save} disabled={update.isPending}>
            {update.isPending ? 'Saving…' : 'Save projects'}
          </Button>
        }
      />

      <Card>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5 block">Title</Label>
            <Input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Portfolio Website"
            />
          </div>
          <div>
            <Label className="mb-1.5 block">Tech stack (comma-separated)</Label>
            <Input
              value={draft.techStack}
              onChange={(e) => setDraft({ ...draft, techStack: e.target.value })}
              placeholder="react, css, node"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Description</Label>
            <Input
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="What it does and your role"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Link (optional)</Label>
            <Input
              value={draft.link}
              onChange={(e) => setDraft({ ...draft, link: e.target.value })}
              placeholder="https://github.com/…"
            />
          </div>
          <div>
            <Button type="button" variant="secondary" onClick={add}>
              <Plus className="mr-1 h-4 w-4" /> Add project
            </Button>
          </div>
        </CardContent>
      </Card>

      {projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Add a project to strengthen your profile." icon={FolderGit2} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.map((p, i) => (
            <Card key={`${p.title}-${i}`}>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{p.title}</p>
                  <button
                    onClick={() => remove(i)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${p.title}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
                {p.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((t) => (
                      <span key={t} className="rounded bg-muted px-2 py-0.5 text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Open <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
