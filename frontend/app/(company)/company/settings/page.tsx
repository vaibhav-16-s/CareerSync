'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import {
  User,
  KeyRound,
  Palette,
  LinkIcon,
  LogOut,
  Building2,
  PlusCircle,
  Bell,
  GitBranch,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth.service';
import { DataSecurityCard } from '@/components/shared/data-security-card';
import { useLogout } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth.store';

const QUICK_LINKS = [
  { label: 'Company profile', href: '/company/profile', icon: Building2 },
  { label: 'Post internship', href: '/company/internships/new', icon: PlusCircle },
  { label: 'Hiring pipeline', href: '/company/pipeline', icon: GitBranch },
  { label: 'Notifications', href: '/company/notifications', icon: Bell },
];

export default function CompanySettingsPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Your account and company preferences." />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        {/* Account */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4 text-primary" /> Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Email: </span>{user?.email}</p>
            <p><span className="text-muted-foreground">Role: </span><span className="capitalize">{user?.role}</span></p>
            <p className="pt-1 text-xs text-muted-foreground">
              Company details, logo and verification live on your{' '}
              <Link href="/company/profile" className="text-primary hover:underline">Company profile</Link>.
            </p>
          </CardContent>
        </Card>

        {/* Appearance */}
        <AppearanceCard />

        {/* Change password */}
        <ChangePasswordCard />

        {/* Quick links */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><LinkIcon className="h-4 w-4 text-primary" /> Quick links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {QUICK_LINKS.map((l) => (
              <Button key={l.href} variant="outline" className="justify-start" asChild>
                <Link href={l.href}><l.icon className="mr-2 h-4 w-4" /> {l.label}</Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Data security */}
      <DataSecurityCard />

      {/* Danger zone */}
      <Card className="border-red-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-red-600"><LogOut className="h-4 w-4" /> Sign out</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Sign out of your account on this device.</p>
          <Button variant="destructive" disabled={logout.isPending} onClick={() => logout.mutate()}>
            <LogOut className="mr-1.5 h-4 w-4" /> {logout.isPending ? 'Signing out…' : 'Sign out'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AppearanceCard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const options = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base"><Palette className="h-4 w-4 text-primary" /> Appearance</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-sm text-muted-foreground">Theme</p>
        <div className="grid grid-cols-3 gap-2">
          {options.map((o) => {
            const active = mounted && theme === o.key;
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => setTheme(o.key)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition-colors',
                  active ? 'border-primary bg-primary/5 text-primary' : 'hover:bg-muted'
                )}
              >
                <o.icon className="h-5 w-5" />
                {o.label}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ChangePasswordCard() {
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');

  const mutation = useMutation({
    mutationFn: () => authService.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success('Password changed');
      setCurrent('');
      setNew('');
      setConfirm('');
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : 'Could not change password';
      toast.error(msg);
    },
  });

  const submit = () => {
    if (!currentPassword || !newPassword) return toast.error('Fill in both password fields');
    if (newPassword.length < 8) return toast.error('New password must be at least 8 characters');
    if (newPassword !== confirm) return toast.error('New passwords do not match');
    if (newPassword === currentPassword) return toast.error('New password must be different');
    mutation.mutate();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base"><KeyRound className="h-4 w-4 text-primary" /> Change password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="mb-1.5 block text-xs">Current password</Label>
          <Input type="password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">New password</Label>
          <Input type="password" value={newPassword} onChange={(e) => setNew(e.target.value)} autoComplete="new-password" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs">Confirm new password</Label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        </div>
        <Button onClick={submit} disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? 'Updating…' : 'Update password'}
        </Button>
      </CardContent>
    </Card>
  );
}
