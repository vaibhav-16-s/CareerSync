'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, WandSparkles } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/ui/loader';
import { Textarea } from '@/components/ui/textarea';
import { useAnalyzeResumeText } from '@/hooks/use-resume';
import { useStudentProfile } from '@/hooks/use-student';
import { useAuthStore } from '@/store/auth.store';

interface ResumeDraft {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  skills: string;
  education: string;
  experience: string;
  projects: string;
  certifications: string;
}

const EMPTY_DRAFT: ResumeDraft = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  github: '',
  linkedin: '',
  portfolio: '',
  summary: '',
  skills: '',
  education: '',
  experience: '',
  projects: '',
  certifications: '',
};

function buildResumeText(draft: ResumeDraft): string {
  const sections = [
    draft.name,
    draft.title,
    [draft.email, draft.phone, draft.location, draft.github, draft.linkedin, draft.portfolio]
      .filter(Boolean)
      .join(' | '),
    draft.summary && `SUMMARY\n${draft.summary}`,
    draft.skills && `SKILLS\n${draft.skills}`,
    draft.education && `EDUCATION\n${draft.education}`,
    draft.experience && `EXPERIENCE\n${draft.experience}`,
    draft.projects && `PROJECTS\n${draft.projects}`,
    draft.certifications && `CERTIFICATIONS\n${draft.certifications}`,
  ];

  return sections.filter(Boolean).join('\n\n');
}

async function downloadResume(draft: ResumeDraft): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 44;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const write = (text: string, size = 10, bold = false, color: [number, number, number] = [30, 41, 59]) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);

    const lines = text.split(/\r?\n/).flatMap((line) => doc.splitTextToSize(line, maxWidth));
    for (const line of lines) {
      if (y + size * 1.4 > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += size * 1.4;
    }
    y += 4;
  };

  write(draft.name || 'Your Name', 20, true, [15, 23, 42]);
  if (draft.title) write(draft.title, 11, true, [79, 70, 229]);

  const contact = [
    draft.email && `Email: ${draft.email}`,
    draft.phone && `Phone: ${draft.phone}`,
    draft.location && `Location: ${draft.location}`,
    draft.github && `GitHub: ${draft.github}`,
    draft.linkedin && `LinkedIn: ${draft.linkedin}`,
    draft.portfolio && `Portfolio: ${draft.portfolio}`,
  ].filter(Boolean);
  if (contact.length) write(contact.join(' | '), 9, false, [100, 116, 139]);

  const sections: Array<[string, string]> = [
    ['Summary', draft.summary],
    ['Skills', draft.skills],
    ['Education', draft.education],
    ['Experience', draft.experience],
    ['Projects', draft.projects],
    ['Certifications', draft.certifications],
  ];

  for (const [title, content] of sections) {
    if (!content.trim()) continue;
    y += 8;
    write(title.toUpperCase(), 10, true, [51, 65, 85]);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y - 6, pageWidth - margin, y - 6);
    write(content);
  }

  const fileName = (draft.name || 'resume').trim().replace(/[^\w.-]+/g, '_');
  doc.save(`${fileName}-resume.pdf`);
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

export default function BuildResumePage() {
  const router = useRouter();
  const { data: profile, isLoading } = useStudentProfile();
  const analyze = useAnalyzeResumeText();
  const email = useAuthStore((state) => state.user?.email);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (!profile || prefilled) return;

    setDraft({
      name: profile.name ?? '',
      title: profile.headline ?? '',
      email: email ?? '',
      phone: profile.phone ?? '',
      location: [profile.location?.city, profile.location?.country].filter(Boolean).join(', '),
      github: profile.links?.github ?? '',
      linkedin: profile.links?.linkedin ?? '',
      portfolio: profile.links?.portfolio ?? '',
      summary: profile.bio ?? '',
      skills: (profile.skills ?? []).map((skill) => skill.name).join(', '),
      education: (profile.education ?? [])
        .map((item) =>
          [item.degree, item.college, [item.startYear, item.endYear].filter(Boolean).join(' - '), item.gpa && `${item.gpa} GPA`]
            .filter(Boolean)
            .join(' | ')
        )
        .join('\n'),
      experience: '',
      projects: (profile.projects ?? [])
        .map((project) =>
          [
            project.title,
            project.description,
            project.techStack?.length ? `Technologies: ${project.techStack.join(', ')}` : '',
            project.link,
          ]
            .filter(Boolean)
            .join(' | ')
        )
        .join('\n'),
      certifications: (profile.certifications ?? [])
        .map((certification) => [certification.name, certification.issuer].filter(Boolean).join(' | '))
        .join('\n'),
    });
    setPrefilled(true);
  }, [email, prefilled, profile]);

  const resumeText = useMemo(() => buildResumeText(draft), [draft]);
  const wordCount = useMemo(() => resumeText.split(/\s+/).filter(Boolean).length, [resumeText]);

  const update = (field: keyof ResumeDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleDownload = async () => {
    if (!draft.name.trim()) {
      toast.error('Add your name before downloading.');
      return;
    }
    try {
      await downloadResume(draft);
      toast.success('Resume downloaded as PDF.');
    } catch {
      toast.error('Could not generate the PDF. Please try again.');
    }
  };

  const handleAnalyze = () => {
    if (!draft.name.trim()) {
      toast.error('Add your name before analyzing.');
      return;
    }
    if (wordCount < 30) {
      toast.error('Add more detail to your resume before analyzing (at least 30 words).');
      return;
    }

    analyze.mutate(
      { text: resumeText, name: draft.name },
      {
        onSuccess: (version) => {
          toast.success(`Resume analyzed — score ${version.report?.overallScore ?? '—'}/100`);
          router.push('/student/resume');
        },
      }
    );
  };

  if (isLoading) return <Loader label="Loading your details…" />;

  const fields: Array<{ key: keyof ResumeDraft; label: string; placeholder: string; rows?: number }> = [
    { key: 'name', label: 'Full name', placeholder: 'Your name' },
    { key: 'title', label: 'Professional title', placeholder: 'Computer science student | Frontend developer' },
    { key: 'email', label: 'Email', placeholder: 'you@example.com' },
    { key: 'phone', label: 'Phone', placeholder: '+1 555 123 4567' },
    { key: 'location', label: 'Location', placeholder: 'City, Country' },
    { key: 'github', label: 'GitHub', placeholder: 'github.com/username' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
    { key: 'portfolio', label: 'Portfolio', placeholder: 'yourwebsite.com' },
    { key: 'summary', label: 'Professional summary', placeholder: 'A few lines about your experience and career goals.', rows: 4 },
    { key: 'skills', label: 'Skills', placeholder: 'React, TypeScript, Node.js, SQL', rows: 3 },
    { key: 'education', label: 'Education', placeholder: 'Degree | Institution | Years | GPA (one entry per line)', rows: 4 },
    { key: 'experience', label: 'Experience', placeholder: 'Role | Company | Dates | Achievements (one entry per line)', rows: 4 },
    { key: 'projects', label: 'Projects', placeholder: 'Project | Description | Technologies | Link (one entry per line)', rows: 4 },
    { key: 'certifications', label: 'Certifications', placeholder: 'Certification | Issuer (one entry per line)', rows: 3 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Build your resume"
        description="Your profile details are pre-filled. Edit them, preview your resume, then download it or analyze it."
        action={
          <Button asChild variant="outline">
            <Link href="/student/resume">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Resume Intelligence
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resume details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map(({ key, label, placeholder, rows }) => (
              <Field key={key} label={label}>
                {rows ? (
                  <Textarea
                    rows={rows}
                    value={draft[key]}
                    onChange={(event) => update(key, event.target.value)}
                    placeholder={placeholder}
                  />
                ) : (
                  <Input
                    value={draft[key]}
                    onChange={(event) => update(key, event.target.value)}
                    placeholder={placeholder}
                  />
                )}
              </Field>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">Live preview</h2>
            <span className="text-xs text-muted-foreground">{wordCount} words</span>
          </div>
          <Card className="max-h-[70vh] overflow-auto bg-white text-slate-800">
            <CardContent className="space-y-4 p-8">
              <div className="border-b pb-3">
                <h1 className="text-2xl font-bold">{draft.name || 'Your Name'}</h1>
                {draft.title && <p className="mt-1 text-primary">{draft.title}</p>}
                <p className="mt-2 whitespace-pre-wrap text-xs text-slate-500">
                  {[draft.email, draft.phone, draft.location, draft.github, draft.linkedin, draft.portfolio]
                    .filter(Boolean)
                    .join(' | ') || 'Your contact details'}
                </p>
              </div>
              {[
                ['Summary', draft.summary],
                ['Skills', draft.skills],
                ['Education', draft.education],
                ['Experience', draft.experience],
                ['Projects', draft.projects],
                ['Certifications', draft.certifications],
              ].map(([title, content]) =>
                content ? (
                  <section key={title}>
                    <h3 className="mb-1 border-b pb-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                      {title}
                    </h3>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
                  </section>
                ) : null
              )}
            </CardContent>
          </Card>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-1 h-4 w-4" /> Download PDF
            </Button>
            <Button onClick={handleAnalyze} disabled={analyze.isPending}>
              <WandSparkles className="mr-1 h-4 w-4" />
              {analyze.isPending ? 'Analyzing…' : 'Save & analyze'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
