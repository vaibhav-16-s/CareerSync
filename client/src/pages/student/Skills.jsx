import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, X, Sparkles, Pencil, Code2, LayoutTemplate, Server, Database as DatabaseIcon, Cloud, Palette, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudentProfile, useUpdateStudentProfile } from '@/hooks/use-student';
import { Proficiency } from '@/types';

// Popular skills grouped by category — clicking any adds it instantly.
const SUGGESTED = {
    Languages: { icon: Code2, items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'SQL'] },
    Frontend: { icon: LayoutTemplate, items: ['React', 'Next.js', 'Vue', 'HTML', 'CSS', 'Tailwind', 'Redux'] },
    Backend: { icon: Server, items: ['Node.js', 'Express', 'Django', 'Flask', 'Spring', 'GraphQL'] },
    Database: { icon: DatabaseIcon, items: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis'] },
    'Cloud & DevOps': { icon: Cloud, items: ['AWS', 'Docker', 'Kubernetes', 'Git', 'CI/CD'] },
    'Design & Soft': { icon: Palette, items: ['Figma', 'UI/UX', 'Communication', 'Leadership', 'Teamwork'] },
};

// Visual language for each proficiency level, reused across the select,
// the "your skills" chips, and the breakdown summary.
const PROFICIENCY_STYLES = {
    [Proficiency.BEGINNER]: { dot: 'bg-muted-foreground/50', text: 'text-muted-foreground', label: 'Beginner' },
    [Proficiency.INTERMEDIATE]: { dot: 'bg-primary', text: 'text-primary', label: 'Intermediate' },
    [Proficiency.ADVANCED]: { dot: 'bg-success', text: 'text-success', label: 'Advanced' },
};

const normId = (s) => s.toLowerCase().replace(/[.\s_-]+/g, '');

export default function SkillsPage() {
    const { data, isLoading } = useStudentProfile();
    const update = useUpdateStudentProfile();
    const inputRef = useRef(null);
    const [skills, setSkills] = useState([]);
    const [name, setName] = useState('');
    const [prof, setProf] = useState(Proficiency.INTERMEDIATE);
    useEffect(() => {
        if (data?.skills)
            setSkills(data.skills);
    }, [data]);
    if (isLoading)
        return <Loader label="Loading your skills…"/>;
    const has = (raw) => skills.some((s) => normId(s.skillId || s.name) === normId(raw));
    const addSkill = (raw, proficiency = prof) => {
        const trimmed = raw.trim();
        if (!trimmed || has(trimmed))
            return;
        setSkills((s) => [...s, { skillId: normId(trimmed), name: trimmed, proficiency }]);
    };
    const addFromInput = () => {
        addSkill(name);
        setName('');
    };
    const remove = (i) => setSkills((s) => s.filter((_, idx) => idx !== i));
    const save = () => update.mutate({ skills });
    const focusOther = () => inputRef.current?.focus();

    const counts = useMemo(() => {
        const c = { [Proficiency.BEGINNER]: 0, [Proficiency.INTERMEDIATE]: 0, [Proficiency.ADVANCED]: 0 };
        skills.forEach((s) => {
            if (c[s.proficiency] !== undefined)
                c[s.proficiency] += 1;
        });
        return c;
    }, [skills]);
    const allSuggestedAdded = Object.values(SUGGESTED).every(({ items }) => items.every((s) => has(s)));

    return (<div className="space-y-6">
      <PageHeader title="Skills" description="Add the skills you have — they drive your match scores and recommendations." icon={Sparkles} stats={[{ label: 'skills added', value: skills.length }]} action={<Button onClick={save} disabled={update.isPending}>
            {update.isPending ? 'Saving…' : 'Save skills'}
          </Button>}/>

      {/* Add a custom skill */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Add a skill</CardTitle>
          <CardDescription>Search for any skill and set how confident you are with it.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Input ref={inputRef} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addFromInput()} placeholder="Type any skill — e.g. React, Python, Figma" className="flex-1"/>
          <Select value={prof} onValueChange={setProf}>
            <SelectTrigger aria-label="Proficiency" className="sm:w-44">
              <span className="flex items-center gap-2">
                <span className={cn('inline-block h-2 w-2 shrink-0 rounded-full', PROFICIENCY_STYLES[prof].dot)}/>
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent>
              {Object.values(Proficiency).map((p) => (<SelectItem key={p} value={p}>
                  <span className="flex items-center gap-2">
                    <span className={cn('inline-block h-2 w-2 shrink-0 rounded-full', PROFICIENCY_STYLES[p].dot)}/>
                    {PROFICIENCY_STYLES[p].label}
                  </span>
                </SelectItem>))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={addFromInput} variant="secondary" className="sm:w-auto">
            <Plus className="mr-1 h-4 w-4"/> Add
          </Button>
        </CardContent>
      </Card>

      {/* Suggested skills (click to add at the selected level) */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary"/> Suggested skills
          </CardTitle>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            <span className={cn('inline-block h-1.5 w-1.5 rounded-full', PROFICIENCY_STYLES[prof].dot)}/>
            Adds as “{PROFICIENCY_STYLES[prof].label}”
          </span>
        </CardHeader>
        <CardContent className="max-h-[300px] space-y-5 overflow-y-auto pr-1">
          {allSuggestedAdded ? (<div className="flex items-center gap-3 rounded-lg border border-dashed bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
              <PartyPopper className="h-5 w-5 shrink-0 text-primary"/>
              You've added all our top picks — nice! Add anything else using the field above.
            </div>) : (Object.entries(SUGGESTED).map(([cat, { icon: CatIcon, items: list }]) => {
            const available = list.filter((s) => !has(s));
            if (available.length === 0)
                return null;
            return (<div key={cat}>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <CatIcon className="h-3.5 w-3.5"/> {cat}
                </p>
                <div className="flex flex-wrap gap-2">
                  {available.map((s) => (<button key={s} type="button" onClick={() => addSkill(s)} className="inline-flex items-center gap-1 rounded-full border bg-card px-3 py-1 text-sm shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 hover:text-primary hover:shadow active:translate-y-0">
                      <Plus className="h-3 w-3"/> {s}
                    </button>))}
                </div>
              </div>);
        }))}
          {/* Other — jump to the custom input */}
          <div>
            <button type="button" onClick={focusOther} className="inline-flex items-center gap-1 rounded-full border border-dashed px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              <Pencil className="h-3 w-3"/> Other…
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Your skills (scrollable) */}
      <Card>
        <CardHeader className="space-y-2 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Your skills</CardTitle>
            <span className="text-xs text-muted-foreground">{skills.length} added</span>
          </div>
          {skills.length > 0 && (<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {Object.values(Proficiency).map((p) => counts[p] > 0 && (<span key={p} className="inline-flex items-center gap-1.5">
                    <span className={cn('inline-block h-1.5 w-1.5 rounded-full', PROFICIENCY_STYLES[p].dot)}/>
                    {counts[p]} {PROFICIENCY_STYLES[p].label}
                  </span>))}
            </div>)}
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (<EmptyState title="No skills yet" description="Pick from the suggestions above or type your own." icon={Sparkles}/>) : (<div className="max-h-[360px] overflow-y-auto pr-1">
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => {
            const style = PROFICIENCY_STYLES[s.proficiency];
            return (<span key={`${s.skillId}-${i}`} className="group inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm shadow-sm transition-shadow hover:shadow-md">
                      {style && <span className={cn('inline-block h-1.5 w-1.5 rounded-full', style.dot)}/>}
                      <span className="font-medium">{s.name}</span>
                      <span className={cn('text-xs', style?.text ?? 'text-muted-foreground')}>{style?.label ?? s.proficiency}</span>
                      <button type="button" onClick={() => remove(i)} className="-mr-1 rounded-full p-0.5 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label={`Remove ${s.name}`}>
                        <X className="h-3.5 w-3.5"/>
                      </button>
                    </span>);
        })}
              </div>
            </div>)}
        </CardContent>
      </Card>
    </div>);
}
