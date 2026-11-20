'use client';

import { useSearchParams } from 'next/navigation';
import {
  Users,
  GraduationCap,
  MapPin,
  Briefcase,
  CalendarDays,
  FileText,
  Github,
  Linkedin,
  Globe,
  ExternalLink,
  FolderGit2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MatchScoreBadge, ApplicationStatusBadge } from '@/components/shared/status-badge';
import { useCompanyApplicants } from '@/hooks/use-company';
import { useUpdateApplicationStatus } from '@/hooks/use-applications';
import { ApplicationStatus, type Application, type Student, type Internship } from '@/types';

const COLUMNS: { key: ApplicationStatus; label: string; tint: string }[] = [
  { key: ApplicationStatus.PENDING, label: 'Applied', tint: 'border-t-slate-400' },
  { key: ApplicationStatus.SHORTLISTED, label: 'Shortlisted', tint: 'border-t-amber-400' },
  { key: ApplicationStatus.HIRED, label: 'Hired', tint: 'border-t-emerald-500' },
  { key: ApplicationStatus.REJECTED, label: 'Rejected', tint: 'border-t-red-400' },
];

/** Merge live student profile with the apply-time snapshot into one view model. */
function details(app: Application) {
  const student = (typeof app.studentId === 'object' ? app.studentId : null) as Student | null;
  const snap = app.snapshot;
  const internship = (typeof app.internshipId === 'object' ? app.internshipId : null) as Internship | null;
  return {
    name: student?.name ?? snap?.name ?? 'Applicant',
    headline: student?.headline ?? snap?.headline ?? '',
    avatarUrl: student?.avatarUrl,
    college: student?.college,
    yearOfStudy: student?.yearOfStudy,
    location: [student?.location?.city, student?.location?.country].filter(Boolean).join(', '),
    bio: student?.bio,
    links: student?.links ?? {},
    skills: (student?.skills ?? snap?.skills ?? []) as { name: string; proficiency: string }[],
    projects: (student?.projects ?? snap?.projects ?? []) as {
      title: string;
      techStack: string[];
      link?: string;
    }[],
    resumeUrl: student?.resume?.fileUrl ?? snap?.resumeUrl,
    internshipTitle: internship?.title,
    coverLetter: app.coverLetter,
    appliedAt: app.createdAt,
  };
}

export default function ApplicantsPage() {
  const params = useSearchParams();
  const internshipId = params.get('internshipId') ?? undefined;
  const { data, isLoading } = useCompanyApplicants(internshipId ? { internshipId } : undefined);
  const updateStatus = useUpdateApplicationStatus();

  if (isLoading) return <Loader label="Loading applicants…" />;

  const board = data?.board ?? {};
  const total = data?.total ?? 0;

  const move = (id: string, status: ApplicationStatus) => updateStatus.mutate({ id, status });

  return (
    <>
      <PageHeader
        title="Applicants"
        description={
          internshipId
            ? 'Applicants for the selected internship.'
            : 'Everyone who applied across your internships.'
        }
      />

      {total === 0 ? (
        <EmptyState
          title="No applicants yet"
          description="Applicants will show up here as students apply."
          icon={Users}
        />
      ) : (
        <>
          <div className="grid items-start gap-4 lg:grid-cols-4">
            {COLUMNS.map((col) => {
              const list = (board[col.key] as Application[] | undefined) ?? [];
              return (
                <div key={col.key} className={`rounded-xl border border-t-4 ${col.tint} bg-card`}>
                  <div className="flex items-center justify-between border-b px-3 py-2">
                    <span className="text-sm font-semibold">{col.label}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{list.length}</span>
                  </div>
                  <div className="min-h-[200px] space-y-2 p-2">
                    {list.length === 0 ? (
                      <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
                        Empty
                      </div>
                    ) : (
                      list.map((app) => (
                        <ApplicantCard key={app._id} app={app} onMove={move} busy={updateStatus.isPending} />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <AllApplicants board={board} total={total} onMove={move} busy={updateStatus.isPending} />
        </>
      )}
    </>
  );
}

/** Flat list of every applicant across all stages, below the board. */
function AllApplicants({
  board,
  total,
  onMove,
  busy,
}: {
  board: Record<string, Application[]>;
  total: number;
  onMove: (id: string, s: ApplicationStatus) => void;
  busy: boolean;
}) {
  const all = COLUMNS.flatMap((c) => (board[c.key] as Application[] | undefined) ?? []).sort(
    (a, b) => b.matchScore - a.matchScore
  );

  return (
    <Card className="mt-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold">All applicants</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{total}</span>
        </div>

        {/* Header row (desktop) */}
        <div className="hidden grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-3 border-b px-4 py-2 text-xs font-medium text-muted-foreground md:grid">
          <span>Candidate</span>
          <span>Applied for</span>
          <span>Match</span>
          <span>Status</span>
          <span className="text-right">Profile</span>
        </div>

        <div className="divide-y">
          {all.map((app) => {
            const d = details(app);
            return (
              <div
                key={app._id}
                className="grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-[2fr_1.5fr_1fr_1fr_auto] md:items-center md:gap-3"
              >
                {/* Candidate */}
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar className="h-9 w-9 shrink-0">
                    {d.avatarUrl && <AvatarImage src={d.avatarUrl} alt={d.name} />}
                    <AvatarFallback className="bg-primary/10 text-[11px] text-primary">
                      {d.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {d.headline || [d.college, d.location].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </div>
                </div>

                {/* Applied for */}
                <div className="min-w-0 text-sm text-muted-foreground">
                  <span className="md:hidden text-xs font-medium text-foreground">Applied for: </span>
                  {d.internshipTitle ?? '—'}
                </div>

                {/* Match */}
                <div><MatchScoreBadge score={app.matchScore} /></div>

                {/* Status */}
                <div><ApplicationStatusBadge status={app.status} /></div>

                {/* Profile */}
                <div className="md:text-right">
                  <ApplicantDetailDialog
                    app={app}
                    onMove={onMove}
                    busy={busy}
                    trigger={
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        View profile
                      </Button>
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicantCard({
  app,
  onMove,
  busy,
}: {
  app: Application;
  onMove: (id: string, s: ApplicationStatus) => void;
  busy: boolean;
}) {
  const d = details(app);
  const skills = d.skills.slice(0, 3);

  return (
    <Card className="border shadow-sm">
      <CardContent className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="h-8 w-8 shrink-0">
              {d.avatarUrl && <AvatarImage src={d.avatarUrl} alt={d.name} />}
              <AvatarFallback className="bg-primary/10 text-[11px] text-primary">
                {d.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{d.name}</p>
              {d.headline && (
                <p className="truncate text-[11px] text-muted-foreground">{d.headline}</p>
              )}
            </div>
          </div>
          <MatchScoreBadge score={app.matchScore} />
        </div>

        {(d.college || d.location) && (
          <div className="space-y-0.5 text-[11px] text-muted-foreground">
            {d.college && (
              <p className="flex items-center gap-1 truncate">
                <GraduationCap className="h-3 w-3 shrink-0" />
                {d.college}
                {d.yearOfStudy ? ` · Year ${d.yearOfStudy}` : ''}
              </p>
            )}
            {d.location && (
              <p className="flex items-center gap-1 truncate">
                <MapPin className="h-3 w-3 shrink-0" />
                {d.location}
              </p>
            )}
          </div>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.map((s, i) => (
              <span key={i} className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                {s.name}
              </span>
            ))}
            {d.skills.length > 3 && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                +{d.skills.length - 3}
              </span>
            )}
          </div>
        )}

        <StatusActions app={app} onMove={onMove} busy={busy} />

        <ApplicantDetailDialog app={app} onMove={onMove} busy={busy} />
      </CardContent>
    </Card>
  );
}

function StatusActions({
  app,
  onMove,
  busy,
}: {
  app: Application;
  onMove: (id: string, s: ApplicationStatus) => void;
  busy: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {app.status === ApplicationStatus.PENDING && (
        <>
          <Button size="sm" variant="secondary" className="h-7 flex-1 text-xs" disabled={busy} onClick={() => onMove(app._id, ApplicationStatus.SHORTLISTED)}>Shortlist</Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs" disabled={busy} onClick={() => onMove(app._id, ApplicationStatus.REJECTED)}>Reject</Button>
        </>
      )}
      {app.status === ApplicationStatus.SHORTLISTED && (
        <>
          <Button size="sm" className="h-7 flex-1 text-xs" disabled={busy} onClick={() => onMove(app._id, ApplicationStatus.HIRED)}>Hire</Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs" disabled={busy} onClick={() => onMove(app._id, ApplicationStatus.REJECTED)}>Reject</Button>
        </>
      )}
      {app.status === ApplicationStatus.REJECTED && (
        <Button size="sm" variant="outline" className="h-7 text-xs" disabled={busy} onClick={() => onMove(app._id, ApplicationStatus.SHORTLISTED)}>Reconsider</Button>
      )}
      {app.status === ApplicationStatus.HIRED && (
        <span className="text-xs font-medium text-emerald-600">✓ Hired</span>
      )}
    </div>
  );
}

function ApplicantDetailDialog({
  app,
  onMove,
  busy,
  trigger,
}: {
  app: Application;
  onMove: (id: string, s: ApplicationStatus) => void;
  busy: boolean;
  trigger?: React.ReactNode;
}) {
  const d = details(app);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="h-7 w-full text-xs">
            View full profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3 pr-6">
            <Avatar className="h-14 w-14 shrink-0">
              {d.avatarUrl && <AvatarImage src={d.avatarUrl} alt={d.name} />}
              <AvatarFallback className="bg-primary/10 text-primary">
                {d.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <DialogTitle className="truncate">{d.name}</DialogTitle>
              {d.headline && <p className="text-sm text-muted-foreground">{d.headline}</p>}
              <div className="mt-1">
                <MatchScoreBadge score={app.matchScore} />
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {d.internshipTitle && (
            <Meta icon={Briefcase} label="Applied for" value={d.internshipTitle} />
          )}
          {d.appliedAt && (
            <Meta icon={CalendarDays} label="Applied on" value={new Date(d.appliedAt).toLocaleDateString()} />
          )}
          {d.college && (
            <Meta icon={GraduationCap} label="Education" value={`${d.college}${d.yearOfStudy ? ` · Year ${d.yearOfStudy}` : ''}`} />
          )}
          {d.location && <Meta icon={MapPin} label="Location" value={d.location} />}
        </div>

        {d.bio && (
          <Section title="About">
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{d.bio}</p>
          </Section>
        )}

        {d.skills.length > 0 && (
          <Section title={`Skills (${d.skills.length})`}>
            <div className="flex flex-wrap gap-1.5">
              {d.skills.map((s, i) => (
                <span key={i} className="rounded-md bg-muted px-2 py-1 text-xs">
                  {s.name}
                  {s.proficiency && (
                    <span className="ml-1 text-[10px] capitalize text-muted-foreground">· {s.proficiency}</span>
                  )}
                </span>
              ))}
            </div>
          </Section>
        )}

        {d.projects.length > 0 && (
          <Section title="Projects">
            <div className="space-y-2">
              {d.projects.map((p, i) => (
                <div key={i} className="rounded-lg border p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex items-center gap-1.5 text-sm font-medium">
                      <FolderGit2 className="h-3.5 w-3.5 text-muted-foreground" /> {p.title}
                    </p>
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" title="Open project" aria-label="Open project">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  {p.techStack?.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.techStack.map((t, j) => (
                        <span key={j} className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {d.coverLetter && (
          <Section title="Cover letter">
            <p className="whitespace-pre-wrap rounded-lg border bg-muted/40 p-3 text-sm">{d.coverLetter}</p>
          </Section>
        )}

        {/* Links + resume */}
        <div className="flex flex-wrap gap-2">
          {d.resumeUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={d.resumeUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-1.5 h-4 w-4" /> Open resume
              </a>
            </Button>
          )}
          {d.links.github && (
            <Button variant="outline" size="sm" asChild>
              <a href={d.links.github} target="_blank" rel="noopener noreferrer"><Github className="mr-1.5 h-4 w-4" /> GitHub</a>
            </Button>
          )}
          {d.links.linkedin && (
            <Button variant="outline" size="sm" asChild>
              <a href={d.links.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="mr-1.5 h-4 w-4" /> LinkedIn</a>
            </Button>
          )}
          {d.links.portfolio && (
            <Button variant="outline" size="sm" asChild>
              <a href={d.links.portfolio} target="_blank" rel="noopener noreferrer"><Globe className="mr-1.5 h-4 w-4" /> Portfolio</a>
            </Button>
          )}
        </div>

        {/* Actions */}
        <div className="border-t pt-3">
          <StatusActions app={app} onMove={onMove} busy={busy} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof Briefcase; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-medium">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}
