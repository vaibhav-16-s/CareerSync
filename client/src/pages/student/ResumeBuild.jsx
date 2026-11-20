import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Download, Wand2, Mail, Phone, MapPin, Github, Linkedin, Globe, } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudentProfile } from '@/hooks/use-student';
import { useAnalyzeResumeText } from '@/hooks/use-resume';
import { useAuthStore } from '@/store/auth.store';
import { Link, useNavigate } from 'react-router-dom';
const EMPTY = {
    name: '', title: '', email: '', phone: '', location: '',
    github: '', linkedin: '', portfolio: '', summary: '', skills: '',
    education: [], experience: [], projects: [], certifications: [],
};
const inputCls = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';
const areaCls = 'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';
export default function ResumeBuilderPage() {
    const router = useNavigate();
    const { data: profile, isLoading } = useStudentProfile();
    const analyze = useAnalyzeResumeText();
    const email = useAuthStore((s) => s.user?.email);
    const [d, setD] = useState(EMPTY);
    const [prefilled, setPrefilled] = useState(false);
    // Pre-fill once from the saved profile so the form starts populated.
    useEffect(() => {
        if (!profile || prefilled)
            return;
        setD({
            name: profile.name ?? '',
            title: profile.headline ?? '',
            email: email ?? '',
            phone: profile.phone ?? '',
            location: [profile.location?.city, profile.location?.country].filter(Boolean).join(', '),
            github: profile.links?.github ?? '',
            linkedin: profile.links?.linkedin ?? '',
            portfolio: profile.links?.portfolio ?? '',
            summary: profile.bio ?? '',
            skills: (profile.skills ?? []).map((s) => s.name).join(', '),
            education: (profile.education ?? []).map((e) => ({
                degree: e.degree ?? '',
                institution: e.college ?? '',
                year: [e.startYear, e.endYear].filter(Boolean).join(' – '),
                score: e.gpa != null ? `${e.gpa} GPA` : '',
            })),
            experience: [],
            projects: (profile.projects ?? []).map((p) => ({
                title: p.title ?? '',
                description: p.description ?? '',
                tech: (p.techStack ?? []).join(', '),
                link: p.link ?? '',
            })),
            certifications: (profile.certifications ?? []).map((c) => ({
                name: c.name ?? '',
                issuer: c.issuer ?? '',
            })),
        });
        setPrefilled(true);
    }, [profile, email, prefilled]);
    const set = (k, v) => setD((s) => ({ ...s, [k]: v }));
    // Field sanitizers: names take letters only; phones take digits only, max 10.
    const onlyAlpha = (v) => v.replace(/[^a-zA-Z\s.'-]/g, '');
    const onlyPhone = (v) => v.replace(/\D/g, '').slice(0, 10);
    // Generic list helpers
    const addItem = (k, blank) => setD((s) => ({ ...s, [k]: [...s[k], blank] }));
    const setItem = (k, i, field, v) => setD((s) => ({ ...s, [k]: s[k].map((it, idx) => (idx === i ? { ...it, [field]: v } : it)) }));
    const removeItem = (k, i) => setD((s) => ({ ...s, [k]: s[k].filter((_, idx) => idx !== i) }));
    const skillList = useMemo(() => d.skills.split(',').map((x) => x.trim()).filter(Boolean), [d.skills]);
    const download = async () => {
        if (!d.name.trim()) {
            toast.error('Add your name before downloading.');
            return;
        }
        try {
            await generatePdf(d, skillList);
            toast.success('Resume downloaded as PDF.');
        }
        catch {
            toast.error('Could not generate the PDF. Please try again.');
        }
    };
    // Analyze the built resume directly (no download/re-upload needed).
    const saveAndAnalyze = () => {
        if (!d.name.trim()) {
            toast.error('Add your name before analyzing.');
            return;
        }
        const text = resumeToText(d, skillList);
        analyze.mutate({ text, name: d.name }, {
            onSuccess: (v) => {
                toast.success(`Resume analyzed — score ${v.report?.overallScore ?? '—'}/100`, {
                    description: 'Opening your Resume page…',
                });
                router('/student/resume');
            },
        });
    };
    if (isLoading)
        return <Loader label="Loading your details…"/>;
    return (<div className="space-y-6">
      <PageHeader title="Build your resume" description="Fill in the form — we pre-fill it from your profile — then download a clean PDF." action={<div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to="/student/resume"><ArrowLeft className="mr-1 h-4 w-4"/> Back</Link>
            </Button>
            <Button variant="outline" onClick={download}><Download className="mr-1 h-4 w-4"/> Download PDF</Button>
            <Button onClick={saveAndAnalyze} disabled={analyze.isPending}>
              <Wand2 className="mr-1 h-4 w-4"/> {analyze.isPending ? 'Analyzing…' : 'Save & analyze'}
            </Button>
          </div>}/>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ---------- FORM ---------- */}
        <div className="space-y-6">
          {/* Contact */}
          <Card>
            <CardHeader><CardTitle className="text-base">Contact details</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <Field label="Full name"><input className={inputCls} value={d.name} onChange={(e) => set('name', onlyAlpha(e.target.value))} placeholder="Aarav Sharma"/></Field>
              <Field label="Professional title"><input className={inputCls} value={d.title} onChange={(e) => set('title', e.target.value)} placeholder="B.Tech CSE · Frontend"/></Field>
              <Field label="Email"><input className={inputCls} value={d.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com"/></Field>
              <Field label="Phone"><input className={inputCls} inputMode="numeric" maxLength={10} value={d.phone} onChange={(e) => set('phone', onlyPhone(e.target.value))} placeholder="9058767010"/></Field>
              <Field label="Location"><input className={inputCls} value={d.location} onChange={(e) => set('location', e.target.value)} placeholder="Bengaluru, India"/></Field>
              <Field label="GitHub"><input className={inputCls} value={d.github} onChange={(e) => set('github', e.target.value)} placeholder="github.com/…"/></Field>
              <Field label="LinkedIn"><input className={inputCls} value={d.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="linkedin.com/in/…"/></Field>
              <Field label="Portfolio"><input className={inputCls} value={d.portfolio} onChange={(e) => set('portfolio', e.target.value)} placeholder="yoursite.com"/></Field>
            </CardContent>
          </Card>

          {/* Summary + skills */}
          <Card>
            <CardHeader><CardTitle className="text-base">Summary &amp; skills</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Field label="Professional summary">
                <textarea className={areaCls} rows={3} value={d.summary} onChange={(e) => set('summary', e.target.value)} placeholder="2–3 lines about who you are and what you're looking for."/>
              </Field>
              <Field label="Skills (comma separated)">
                <textarea className={areaCls} rows={2} value={d.skills} onChange={(e) => set('skills', e.target.value)} placeholder="React, Node.js, Python, SQL"/>
              </Field>
            </CardContent>
          </Card>

          {/* Education */}
          <ListCard title="Education" onAdd={() => addItem('education', { degree: '', institution: '', year: '', score: '' })} empty={d.education.length === 0}>
            {d.education.map((e, i) => (<ItemBlock key={i} onRemove={() => removeItem('education', i)}>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input className={inputCls} value={e.degree} onChange={(ev) => setItem('education', i, 'degree', ev.target.value)} placeholder="Degree (e.g. B.Tech Computer Science)"/>
                  <input className={inputCls} value={e.institution} onChange={(ev) => setItem('education', i, 'institution', ev.target.value)} placeholder="Institution"/>
                  <input className={inputCls} value={e.year} onChange={(ev) => setItem('education', i, 'year', ev.target.value)} placeholder="Years (2022 – 2026)"/>
                  <input className={inputCls} value={e.score} onChange={(ev) => setItem('education', i, 'score', ev.target.value)} placeholder="Marks / GPA (e.g. 8.6 GPA or 88%)"/>
                </div>
              </ItemBlock>))}
          </ListCard>

          {/* Experience */}
          <ListCard title="Experience" onAdd={() => addItem('experience', { role: '', company: '', period: '', description: '' })} empty={d.experience.length === 0}>
            {d.experience.map((e, i) => (<ItemBlock key={i} onRemove={() => removeItem('experience', i)}>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input className={inputCls} value={e.role} onChange={(ev) => setItem('experience', i, 'role', ev.target.value)} placeholder="Role / title"/>
                  <input className={inputCls} value={e.company} onChange={(ev) => setItem('experience', i, 'company', ev.target.value)} placeholder="Company"/>
                  <input className={inputCls} value={e.period} onChange={(ev) => setItem('experience', i, 'period', ev.target.value)} placeholder="Jun 2025 – Aug 2025"/>
                </div>
                <textarea className={`${areaCls} mt-2`} rows={2} value={e.description} onChange={(ev) => setItem('experience', i, 'description', ev.target.value)} placeholder="What you did / achieved."/>
              </ItemBlock>))}
          </ListCard>

          {/* Projects */}
          <ListCard title="Projects" onAdd={() => addItem('projects', { title: '', description: '', tech: '', link: '' })} empty={d.projects.length === 0}>
            {d.projects.map((p, i) => (<ItemBlock key={i} onRemove={() => removeItem('projects', i)}>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input className={inputCls} value={p.title} onChange={(ev) => setItem('projects', i, 'title', ev.target.value)} placeholder="Project title"/>
                  <input className={inputCls} value={p.link} onChange={(ev) => setItem('projects', i, 'link', ev.target.value)} placeholder="Link (optional)"/>
                </div>
                <input className={`${inputCls} mt-2`} value={p.tech} onChange={(ev) => setItem('projects', i, 'tech', ev.target.value)} placeholder="Tech stack (React, Node…)"/>
                <textarea className={`${areaCls} mt-2`} rows={2} value={p.description} onChange={(ev) => setItem('projects', i, 'description', ev.target.value)} placeholder="What it does / your role."/>
              </ItemBlock>))}
          </ListCard>

          {/* Certifications */}
          <ListCard title="Certifications" onAdd={() => addItem('certifications', { name: '', issuer: '' })} empty={d.certifications.length === 0}>
            {d.certifications.map((c, i) => (<ItemBlock key={i} onRemove={() => removeItem('certifications', i)}>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input className={inputCls} value={c.name} onChange={(ev) => setItem('certifications', i, 'name', ev.target.value)} placeholder="Certification name"/>
                  <input className={inputCls} value={c.issuer} onChange={(ev) => setItem('certifications', i, 'issuer', ev.target.value)} placeholder="Issuer"/>
                </div>
              </ItemBlock>))}
          </ListCard>
        </div>

        {/* ---------- LIVE PREVIEW ---------- */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Wand2 className="h-4 w-4 text-primary"/> Live preview
          </div>
          <div className="max-h-[80vh] overflow-auto rounded-xl border bg-white p-8 text-slate-800 shadow-sm">
            <ResumePreview d={d} skills={skillList}/>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={download}><Download className="mr-1 h-4 w-4"/> Download PDF</Button>
            <Button onClick={saveAndAnalyze} disabled={analyze.isPending}>
              <Wand2 className="mr-1 h-4 w-4"/> {analyze.isPending ? 'Analyzing…' : 'Save & analyze'}
            </Button>
          </div>
        </div>
      </div>
    </div>);
}
/* ---------------- Preview (on-page) ---------------- */
function ResumePreview({ d, skills }) {
    return (<div className="mx-auto max-w-[720px] text-sm leading-relaxed">
      <h1 className="text-2xl font-bold text-slate-900">{d.name || 'Your Name'}</h1>
      {d.title && <p className="mt-0.5 text-sm font-medium text-indigo-600">{d.title}</p>}
      <div className="mt-2.5 flex flex-col gap-1 text-xs text-slate-500">
        {d.email && <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0"/>{d.email}</span>}
        {d.phone && <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0"/>{d.phone}</span>}
        {d.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0"/>{d.location}</span>}
        {d.github && <span className="inline-flex items-center gap-1.5"><Github className="h-3.5 w-3.5 shrink-0"/>{d.github}</span>}
        {d.linkedin && <span className="inline-flex items-center gap-1.5"><Linkedin className="h-3.5 w-3.5 shrink-0"/>{d.linkedin}</span>}
        {d.portfolio && <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 shrink-0"/>{d.portfolio}</span>}
      </div>

      {d.summary && <PreviewSection title="Summary"><p>{d.summary}</p></PreviewSection>}

      {skills.length > 0 && (<PreviewSection title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s, i) => <span key={i} className="rounded bg-slate-100 px-2 py-0.5 text-xs">{s}</span>)}
          </div>
        </PreviewSection>)}

      {d.education.some((e) => e.degree || e.institution) && (<PreviewSection title="Education">
          {d.education.map((e, i) => (<div key={i} className="mb-2">
              <div className="flex justify-between">
                <p className="font-semibold text-slate-800">{e.degree || 'Degree'}</p>
                <p className="text-xs text-slate-500">{e.year}</p>
              </div>
              <p className="text-slate-600">{e.institution}{e.score ? ` · ${e.score}` : ''}</p>
            </div>))}
        </PreviewSection>)}

      {d.experience.some((e) => e.role || e.company) && (<PreviewSection title="Experience">
          {d.experience.map((e, i) => (<div key={i} className="mb-2">
              <div className="flex justify-between">
                <p className="font-semibold text-slate-800">{e.role}{e.company ? ` — ${e.company}` : ''}</p>
                <p className="text-xs text-slate-500">{e.period}</p>
              </div>
              {e.description && <p className="text-slate-600">{e.description}</p>}
            </div>))}
        </PreviewSection>)}

      {d.projects.some((p) => p.title) && (<PreviewSection title="Projects">
          {d.projects.map((p, i) => (<div key={i} className="mb-2">
              <p className="font-semibold text-slate-800">{p.title}{p.tech ? <span className="font-normal text-slate-500"> · {p.tech}</span> : null}</p>
              {p.description && <p className="text-slate-600">{p.description}</p>}
              {p.link && <p className="text-xs text-indigo-600">{p.link}</p>}
            </div>))}
        </PreviewSection>)}

      {d.certifications.some((c) => c.name) && (<PreviewSection title="Certifications">
          <ul className="list-disc pl-4">
            {d.certifications.map((c, i) => (<li key={i}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</li>))}
          </ul>
        </PreviewSection>)}
    </div>);
}
function PreviewSection({ title, children }) {
    return (<div className="mt-4">
      <h2 className="mb-1.5 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wider text-slate-700">{title}</h2>
      {children}
    </div>);
}
/* ---------------- Form helpers ---------------- */
function Field({ label, children }) {
    return (<div>
      <Label className="mb-1.5 block text-sm font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>);
}
function ListCard({ title, onAdd, empty, children }) {
    return (<Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}><Plus className="mr-1 h-4 w-4"/> Add</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {empty ? <p className="rounded-lg border border-dashed py-4 text-center text-xs text-muted-foreground">Nothing added yet.</p> : children}
      </CardContent>
    </Card>);
}
function ItemBlock({ children, onRemove }) {
    return (<div className="rounded-lg border p-3">
      <div className="mb-2 flex justify-end">
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={onRemove} aria-label="Remove">
          <Trash2 className="h-4 w-4 text-muted-foreground"/>
        </Button>
      </div>
      {children}
    </div>);
}
/* ---------------- Plain-text serialization (for analysis) ---------------- */
function resumeToText(d, skills) {
    const lines = [];
    lines.push(d.name);
    if (d.title)
        lines.push(d.title);
    lines.push([d.email, d.phone, d.location, d.github, d.linkedin, d.portfolio].filter(Boolean).join(' | '));
    if (d.summary)
        lines.push('', 'SUMMARY', d.summary);
    if (skills.length)
        lines.push('', 'SKILLS', skills.join(', '));
    if (d.education.some((e) => e.degree || e.institution)) {
        lines.push('', 'EDUCATION');
        d.education.forEach((e) => lines.push([e.degree, e.institution, e.year, e.score].filter(Boolean).join(' — ')));
    }
    if (d.experience.some((e) => e.role || e.company)) {
        lines.push('', 'EXPERIENCE');
        d.experience.forEach((e) => {
            lines.push([e.role, e.company, e.period].filter(Boolean).join(' — '));
            if (e.description)
                lines.push(e.description);
        });
    }
    if (d.projects.some((p) => p.title)) {
        lines.push('', 'PROJECTS');
        d.projects.forEach((p) => {
            lines.push([p.title, p.tech].filter(Boolean).join(' — '));
            if (p.description)
                lines.push(p.description);
            if (p.link)
                lines.push(p.link);
        });
    }
    if (d.certifications.some((c) => c.name)) {
        lines.push('', 'CERTIFICATIONS');
        d.certifications.forEach((c) => lines.push([c.name, c.issuer].filter(Boolean).join(' — ')));
    }
    return lines.join('\n');
}
/* ---------------- PDF generation (jsPDF — real text layer, ATS-readable) ---------------- */
async function generatePdf(d, skills) {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const M = 44;
    const maxW = pageW - M * 2;
    let y = M;
    const ensure = (needed) => {
        if (y + needed > pageH - M) {
            doc.addPage();
            y = M;
        }
    };
    const write = (str, { size = 10, style = 'normal', color = [30, 41, 59], gap = 4 } = {}) => {
        doc.setFont('helvetica', style);
        doc.setFontSize(size);
        doc.setTextColor(color[0], color[1], color[2]);
        const lineH = size * 1.25;
        for (const ln of doc.splitTextToSize(str, maxW)) {
            ensure(lineH);
            doc.text(ln, M, y);
            y += lineH;
        }
        y += gap;
    };
    const heading = (title) => {
        y += 6;
        ensure(22);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        doc.text(title.toUpperCase(), M, y);
        y += 5;
        doc.setDrawColor(226, 232, 240);
        doc.line(M, y, pageW - M, y);
        y += 12;
    };
    // Header
    write(d.name || 'Your Name', { size: 20, style: 'bold', color: [15, 23, 42], gap: 2 });
    if (d.title)
        write(d.title, { size: 11, style: 'bold', color: [79, 70, 229], gap: 4 });
    // Contact details, one per line.
    const contactLines = [
        d.email && `Email: ${d.email}`,
        d.phone && `Phone: ${d.phone}`,
        d.location && `Location: ${d.location}`,
        d.github && `GitHub: ${d.github}`,
        d.linkedin && `LinkedIn: ${d.linkedin}`,
        d.portfolio && `Portfolio: ${d.portfolio}`,
    ].filter(Boolean);
    contactLines.forEach((line, i) => write(line, { size: 9, color: [100, 116, 139], gap: i === contactLines.length - 1 ? 6 : 1 }));
    if (d.summary) {
        heading('Summary');
        write(d.summary, { color: [71, 85, 105] });
    }
    if (skills.length) {
        heading('Skills');
        write(skills.join(', '), { color: [71, 85, 105] });
    }
    if (d.education.some((e) => e.degree || e.institution)) {
        heading('Education');
        d.education.filter((e) => e.degree || e.institution).forEach((e) => {
            const head = [e.degree, e.year].filter(Boolean).join('   —   ');
            if (head)
                write(head, { style: 'bold', gap: 1 });
            const sub = [e.institution, e.score].filter(Boolean).join(' · ');
            if (sub)
                write(sub, { color: [71, 85, 105], gap: 6 });
        });
    }
    if (d.experience.some((e) => e.role || e.company)) {
        heading('Experience');
        d.experience.filter((e) => e.role || e.company).forEach((e) => {
            const head = [[e.role, e.company].filter(Boolean).join(' — '), e.period].filter(Boolean).join('   —   ');
            if (head)
                write(head, { style: 'bold', gap: 1 });
            if (e.description)
                write(e.description, { color: [71, 85, 105], gap: 6 });
        });
    }
    if (d.projects.some((p) => p.title)) {
        heading('Projects');
        d.projects.filter((p) => p.title).forEach((p) => {
            const head = [p.title, p.tech].filter(Boolean).join(' · ');
            write(head, { style: 'bold', gap: 1 });
            if (p.description)
                write(p.description, { color: [71, 85, 105], gap: 1 });
            if (p.link)
                write(p.link, { size: 9, color: [79, 70, 229], gap: 6 });
        });
    }
    if (d.certifications.some((c) => c.name)) {
        heading('Certifications');
        d.certifications.filter((c) => c.name).forEach((c) => {
            write(`•  ${[c.name, c.issuer].filter(Boolean).join(' — ')}`, { color: [71, 85, 105], gap: 2 });
        });
    }
    doc.save(`${(d.name || 'resume').replace(/[^\w.-]+/g, '_')}-resume.pdf`);
}
