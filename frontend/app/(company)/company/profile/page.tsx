'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Building2, Camera, Loader2, ShieldCheck, UsersRound, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VerificationBadge } from '@/components/shared/status-badge';
import {
  useCompanyProfile,
  useUpdateCompany,
  useUploadLogo,
  useSubmitVerification,
} from '@/hooks/use-company';
import { VerificationStatus } from '@/types';

export default function CompanyProfilePage() {
  const { data, isLoading } = useCompanyProfile();
  const update = useUpdateCompany();
  const uploadLogo = useUploadLogo();
  const submitVerification = useSubmitVerification();
  const fileRef = useRef<HTMLInputElement>(null);

  const [f, setF] = useState({
    name: '', description: '', website: '', industry: '', size: '', city: '', country: '',
    founder: '', foundedYear: '', headquarters: '', email: '', linkedin: '', twitter: '',
  });
  const [team, setTeam] = useState<{ name: string; title: string }[]>([]);
  const [docUrl, setDocUrl] = useState('');

  useEffect(() => {
    if (data) {
      setF({
        name: data.name ?? '',
        description: data.description ?? '',
        website: data.website ?? '',
        industry: data.industry ?? '',
        size: data.size ?? '',
        city: data.location?.city ?? '',
        country: data.location?.country ?? '',
        founder: data.founder ?? '',
        foundedYear: data.foundedYear ? String(data.foundedYear) : '',
        headquarters: data.headquarters ?? '',
        email: data.email ?? '',
        linkedin: data.socials?.linkedin ?? '',
        twitter: data.socials?.twitter ?? '',
      });
      setTeam((data.leadership ?? []).map((m) => ({ name: m.name, title: m.title ?? '' })));
    }
  }, [data]);

  if (isLoading) return <Loader label="Loading company profile…" />;

  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));

  const addMember = () => setTeam((t) => [...t, { name: '', title: '' }]);
  const setMember = (i: number, k: 'name' | 'title', v: string) =>
    setTeam((t) => t.map((m, idx) => (idx === i ? { ...m, [k]: v } : m)));
  const removeMember = (i: number) => setTeam((t) => t.filter((_, idx) => idx !== i));

  const save = () => {
    const year = parseInt(f.foundedYear, 10);
    update.mutate({
      name: f.name.trim(),
      description: f.description.trim() || undefined,
      website: f.website.trim() || undefined,
      industry: f.industry.trim() || undefined,
      size: f.size.trim() || undefined,
      founder: f.founder.trim() || undefined,
      foundedYear: f.foundedYear && !Number.isNaN(year) ? year : undefined,
      headquarters: f.headquarters.trim() || undefined,
      email: f.email.trim() || undefined,
      socials: { linkedin: f.linkedin.trim() || undefined, twitter: f.twitter.trim() || undefined },
      leadership: team
        .filter((m) => m.name.trim())
        .map((m) => ({ name: m.name.trim(), title: m.title.trim() || undefined })),
      location: { city: f.city.trim() || undefined, country: f.country.trim() || undefined },
    });
  };

  const onLogo = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image');
    uploadLogo.mutate(file);
  };

  const verify = () => {
    if (!docUrl.trim()) return toast.error('Add a verification document URL');
    submitVerification.mutate([{ name: 'Registration document', url: docUrl.trim() }], {
      onSuccess: () => setDocUrl(''),
    });
  };

  const status = data?.verification?.status;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company profile"
        description="This is what students see. Keep it complete and accurate."
        action={<Button onClick={save} disabled={update.isPending}>{update.isPending ? 'Saving…' : 'Save changes'}</Button>}
      />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {/* Left: grouped detail cards */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic info + logo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="group relative">
                  <Avatar className="h-20 w-20 rounded-xl ring-2 ring-border">
                    {data?.logoUrl && <AvatarImage src={data.logoUrl} alt={data.name} className="rounded-xl object-contain" />}
                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary"><Building2 className="h-8 w-8" /></AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadLogo.isPending}
                    aria-label="Change logo"
                    className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-100"
                  >
                    {uploadLogo.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                  </button>
                  <input ref={fileRef} type="file" aria-label="Upload logo" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => onLogo(e.target.files?.[0])} />
                </div>
                <div>
                  <p className="text-lg font-semibold">{data?.name}</p>
                  <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-primary hover:underline">
                    {data?.logoUrl ? 'Change logo' : 'Add logo'}
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Company name"><Input value={f.name} onChange={(e) => set('name', e.target.value)} /></Field>
                <Field label="Website"><Input value={f.website} onChange={(e) => set('website', e.target.value)} placeholder="https://…" /></Field>
                <Field label="Industry"><Input value={f.industry} onChange={(e) => set('industry', e.target.value)} placeholder="Software" /></Field>
                <Field label="Company size"><Input value={f.size} onChange={(e) => set('size', e.target.value)} placeholder="11–50" /></Field>
              </div>
            </CardContent>
          </Card>

          {/* Founding & location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Founding &amp; location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Founder(s)"><Input value={f.founder} onChange={(e) => set('founder', e.target.value)} placeholder="Jane Doe" /></Field>
                <Field label="Founded year"><Input value={f.foundedYear} onChange={(e) => set('foundedYear', e.target.value)} placeholder="2021" inputMode="numeric" /></Field>
                <Field label="Headquarters"><Input value={f.headquarters} onChange={(e) => set('headquarters', e.target.value)} placeholder="Bengaluru, India" /></Field>
                <Field label="City"><Input value={f.city} onChange={(e) => set('city', e.target.value)} placeholder="Bengaluru" /></Field>
                <Field label="Country"><Input value={f.country} onChange={(e) => set('country', e.target.value)} placeholder="India" /></Field>
              </div>
            </CardContent>
          </Card>

          {/* Contact & social */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact &amp; social</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Public email"><Input value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="careers@company.com" type="email" /></Field>
                <Field label="LinkedIn"><Input value={f.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="https://linkedin.com/company/…" /></Field>
                <Field label="Twitter / X"><Input value={f.twitter} onChange={(e) => set('twitter', e.target.value)} placeholder="https://x.com/…" /></Field>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={f.description}
                onChange={(e) => set('description', e.target.value)}
                rows={5}
                placeholder="What your company does…"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </CardContent>
          </Card>

          {/* Team & leadership */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-base"><UsersRound className="h-4 w-4 text-primary" /> Team &amp; leadership</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">Founders and key people students will see on your profile.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addMember}>
                <Plus className="mr-1 h-4 w-4" /> Add member
              </Button>
            </CardHeader>
            <CardContent>
              {team.length === 0 ? (
                <p className="rounded-lg border border-dashed py-4 text-center text-xs text-muted-foreground">
                  No team members added yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {team.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input value={m.name} onChange={(e) => setMember(i, 'name', e.target.value)} placeholder="Full name" className="flex-1" />
                      <Input value={m.title} onChange={(e) => setMember(i, 'title', e.target.value)} placeholder="Title (e.g. CEO)" className="flex-1" />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeMember(i)} aria-label="Remove member">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: compact verification card */}
        <Card className="lg:sticky lg:top-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4 text-primary" /> Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              Status: {status ? <VerificationBadge status={status} /> : '—'}
            </div>
            {status === VerificationStatus.VERIFIED ? (
              <p className="text-xs text-muted-foreground">Your company is verified — internships publish instantly.</p>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  Submit a registration document to get verified and publish internships.
                </p>
                <div>
                  <Label className="mb-1.5 block text-xs">Document URL</Label>
                  <Input value={docUrl} onChange={(e) => setDocUrl(e.target.value)} placeholder="https://…/registration.pdf" />
                </div>
                <Button onClick={verify} disabled={submitVerification.isPending} size="sm" className="w-full">
                  {submitVerification.isPending ? 'Submitting…' : 'Submit for verification'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
