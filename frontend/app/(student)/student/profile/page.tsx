'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  User,
  Lock,
  Mail,
  Pencil,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Building2,
  Globe,
  Save,
  X,
  Camera,
  Loader2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  useStudentProfile,
  useUpdateStudentProfile,
  useUploadAvatar,
  useRemoveAvatar,
} from '@/hooks/use-student';
import { resizeImageToSquare } from '@/lib/image';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import type { Gender } from '@/types';

const inputCls =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

const GENDER_LABEL: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
  prefer_not_to_say: 'Prefer not to say',
};

function initials(name?: string, email?: string) {
  const src = (name || email || '?').trim();
  const parts = src.split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || src[0]?.toUpperCase();
}

export default function ProfilePage() {
  const { data, isLoading } = useStudentProfile();
  const update = useUpdateStudentProfile();
  const uploadAvatar = useUploadAvatar();
  const removeAvatar = useRemoveAvatar();
  const user = useAuthStore((s) => s.user);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickAvatar = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    try {
      const resized = await resizeImageToSquare(file, 256);
      uploadAvatar.mutate(resized);
    } catch {
      toast.error('Could not process that image');
    }
  };

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    headline: '',
    phone: '',
    gender: '' as Gender | '',
    dateOfBirth: '',
    city: '',
    country: '',
    college: '',
    yearOfStudy: '',
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name ?? '',
        headline: data.headline ?? '',
        phone: data.phone ?? '',
        gender: data.gender ?? '',
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : '',
        city: data.location?.city ?? '',
        country: data.location?.country ?? '',
        college: data.college ?? '',
        yearOfStudy: data.yearOfStudy ? String(data.yearOfStudy) : '',
      });
    }
  }, [data]);

  if (isLoading) return <Loader label="Loading your profile…" />;

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSave = () => {
    update.mutate(
      {
        name: form.name.trim(),
        headline: form.headline.trim() || undefined,
        phone: form.phone.trim() || undefined,
        gender: form.gender || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        college: form.college.trim() || undefined,
        yearOfStudy: form.yearOfStudy ? Number(form.yearOfStudy) : undefined,
        location: {
          city: form.city.trim() || undefined,
          country: form.country.trim() || undefined,
        },
      },
      { onSuccess: () => setEditing(false) }
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Your details power matching, recommendations and applications."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* ---------- Personal information ---------- */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">Personal Information</h2>
                  <p className="text-xs text-muted-foreground">Update your personal details</p>
                </div>
              </div>
              {editing ? (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                    <X className="mr-1 h-4 w-4" /> Cancel
                  </Button>
                  <Button size="sm" onClick={onSave} disabled={update.isPending}>
                    <Save className="mr-1 h-4 w-4" />
                    {update.isPending ? 'Saving…' : 'Save'}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Pencil className="mr-1 h-4 w-4" /> Edit
                </Button>
              )}
            </div>

            {/* Avatar header */}
            <div className="mt-6 flex items-center gap-4">
              <div className="group/avatar relative">
                <Avatar className="h-20 w-20 ring-2 ring-border">
                  {data?.avatarUrl && <AvatarImage src={data.avatarUrl} alt={data.name} />}
                  <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                    {initials(data?.name, user?.email)}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadAvatar.isPending}
                  aria-label="Change profile photo"
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover/avatar:opacity-100 disabled:opacity-100"
                >
                  {uploadAvatar.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  aria-label="Upload profile photo"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => onPickAvatar(e.target.files?.[0])}
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">{data?.name || '—'}</p>
                <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
                <div className="mt-1 flex gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-primary hover:underline"
                  >
                    {data?.avatarUrl ? 'Change photo' : 'Add photo'}
                  </button>
                  {data?.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => removeAvatar.mutate()}
                      disabled={removeAvatar.isPending}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Fields */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FieldOrView editing={editing} label="Full Name" icon={User} value={data?.name}>
                <Input value={form.name} onChange={(e) => set('name', e.target.value)} />
              </FieldOrView>

              <FieldOrView editing={editing} label="Headline" icon={Pencil} value={data?.headline}>
                <Input value={form.headline} onChange={(e) => set('headline', e.target.value)} />
              </FieldOrView>

              <FieldOrView editing={editing} label="Phone Number" icon={Phone} value={data?.phone}>
                <Input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
              </FieldOrView>

              <FieldOrView
                editing={editing}
                label="Gender"
                icon={User}
                value={data?.gender ? GENDER_LABEL[data.gender] : undefined}
              >
                <select
                  aria-label="Gender"
                  value={form.gender}
                  onChange={(e) => set('gender', e.target.value)}
                  className={inputCls}
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </FieldOrView>

              <FieldOrView
                editing={editing}
                label="Date of Birth"
                icon={Calendar}
                value={data?.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : undefined}
              >
                <Input type="date" value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} />
              </FieldOrView>

              <FieldOrView editing={editing} label="College" icon={Building2} value={data?.college}>
                <Input value={form.college} onChange={(e) => set('college', e.target.value)} />
              </FieldOrView>

              <FieldOrView
                editing={editing}
                label="Year of Study"
                icon={GraduationCap}
                value={data?.yearOfStudy ? `Year ${data.yearOfStudy}` : undefined}
              >
                <Input type="number" min={1} max={6} value={form.yearOfStudy} onChange={(e) => set('yearOfStudy', e.target.value)} />
              </FieldOrView>

              <FieldOrView editing={editing} label="City" icon={MapPin} value={data?.location?.city}>
                <Input value={form.city} onChange={(e) => set('city', e.target.value)} />
              </FieldOrView>

              <FieldOrView editing={editing} label="Country" icon={Globe} value={data?.location?.country}>
                <Input value={form.country} onChange={(e) => set('country', e.target.value)} />
              </FieldOrView>
            </div>
          </CardContent>
        </Card>

        {/* ---------- Security ---------- */}
        <SecurityCard email={user?.email} />
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function FieldOrView({
  editing,
  label,
  icon: Icon,
  value,
  children,
}: {
  editing: boolean;
  label: string;
  icon: typeof User;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</Label>
      {editing ? (
        children
      ) : (
        <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className={value ? '' : 'text-muted-foreground'}>{value || 'Not set'}</span>
        </div>
      )}
    </div>
  );
}

function SecurityCard({ email }: { email?: string }) {
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (pw.next !== pw.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw.next)) {
      toast.error('Password needs 8+ chars with upper, lower and a digit');
      return;
    }
    setBusy(true);
    try {
      await authService.changePassword(pw.current, pw.next);
      toast.success('Password changed');
      setPw({ current: '', next: '', confirm: '' });
      setOpen(false);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? 'Could not change password';
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card id="security" className="scroll-mt-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Security</h2>
            <p className="text-xs text-muted-foreground">Manage your account security settings</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {/* Email */}
          <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <Mail className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-sm font-medium">Email Address</p>
                <p className="truncate text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled title="Coming soon">
              Change Email
            </Button>
          </div>

          {/* Password */}
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="text-sm tracking-widest text-muted-foreground">••••••••</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)}>
                {open ? 'Cancel' : 'Change Password'}
              </Button>
            </div>

            {open && (
              <div className="mt-4 space-y-3 border-t pt-4">
                <div>
                  <Label className="mb-1.5 block text-xs">Current password</Label>
                  <Input
                    type="password"
                    value={pw.current}
                    onChange={(e) => setPw({ ...pw, current: e.target.value })}
                    autoComplete="current-password"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block text-xs">New password</Label>
                  <Input
                    type="password"
                    value={pw.next}
                    onChange={(e) => setPw({ ...pw, next: e.target.value })}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block text-xs">Confirm new password</Label>
                  <Input
                    type="password"
                    value={pw.confirm}
                    onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                    autoComplete="new-password"
                  />
                </div>
                <Button size="sm" onClick={submit} disabled={busy || !pw.current || !pw.next}>
                  {busy ? 'Updating…' : 'Update password'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
