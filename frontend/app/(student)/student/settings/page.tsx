'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataSecurityCard } from '@/components/shared/data-security-card';
import { useStudentProfile, useUpdateStudentProfile } from '@/hooks/use-student';
import { useAuthStore } from '@/store/auth.store';
import type { Student } from '@/types';

const inputCls =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

type Seeking = Student['jobSeekingStatus'];

const DEFAULT_NOTIFICATION_PREFS: Student['notificationPreferences'] = {
  email: { applicationUpdates: true, newMatches: true },
  whatsapp: { enabled: false, applicationUpdates: true, newMatches: false },
};

export default function SettingsPage() {
  const { data, isLoading } = useStudentProfile();
  const update = useUpdateStudentProfile();
  const user = useAuthStore((s) => s.user);

  const [seeking, setSeeking] = useState<Seeking>('active');
  const [discovery, setDiscovery] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [prefs, setPrefs] = useState(DEFAULT_NOTIFICATION_PREFS);

  useEffect(() => {
    if (data) {
      setSeeking(data.jobSeekingStatus ?? 'active');
      setDiscovery(data.consent?.candidateDiscovery ?? true);
      setWhatsappNumber(data.whatsappNumber ?? '');
      setPrefs(data.notificationPreferences ?? DEFAULT_NOTIFICATION_PREFS);
    }
  }, [data]);

  if (isLoading) return <Loader label="Loading settings…" />;

  const save = () => {
    if (prefs.whatsapp.enabled && !whatsappNumber.trim()) {
      toast.error('Add a WhatsApp number to enable WhatsApp notifications');
      return;
    }
    update.mutate({
      jobSeekingStatus: seeking,
      consent: {
        candidateDiscovery: discovery,
        dataProcessing: data?.consent?.dataProcessing ?? true,
      },
      whatsappNumber: whatsappNumber.trim(),
      notificationPreferences: prefs,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your job-seeking status, notifications and privacy preferences."
        action={
          <Button onClick={save} disabled={update.isPending}>
            {update.isPending ? 'Saving…' : 'Save settings'}
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Email: </span>
            {user?.email}
          </p>
          <p>
            <span className="text-muted-foreground">Role: </span>
            {user?.role}
          </p>
          <p className="text-xs text-muted-foreground">
            Personal details (name, phone, gender, location) live on your{' '}
            <Link href="/student/profile" className="text-primary hover:underline">
              Profile
            </Link>
            . Password and account security live on the{' '}
            <Link href="/student/profile#security" className="text-primary hover:underline">
              Security
            </Link>{' '}
            section there.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="seeking" className="mb-1.5 block">Job-seeking status</Label>
            <select
              id="seeking"
              aria-label="Job-seeking status"
              value={seeking}
              onChange={(e) => setSeeking(e.target.value as Seeking)}
              className={inputCls}
            >
              <option value="active">Actively looking</option>
              <option value="passive">Open to offers</option>
              <option value="closed">Not looking</option>
            </select>
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={discovery}
              onChange={(e) => setDiscovery(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <span>
              Allow companies to discover my profile
              <span className="block text-xs text-muted-foreground">
                When on, verified companies can find you in candidate search.
              </span>
            </span>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium">Email</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={prefs.email.applicationUpdates}
                  onChange={(e) =>
                    setPrefs((p) => ({
                      ...p,
                      email: { ...p.email, applicationUpdates: e.target.checked },
                    }))
                  }
                  className="h-4 w-4 rounded border-input"
                />
                Application status updates
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={prefs.email.newMatches}
                  onChange={(e) =>
                    setPrefs((p) => ({
                      ...p,
                      email: { ...p.email, newMatches: e.target.checked },
                    }))
                  }
                  className="h-4 w-4 rounded border-input"
                />
                New matching internships
              </label>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="mb-2 text-sm font-medium">WhatsApp</p>
            <div className="space-y-3">
              <div>
                <Label htmlFor="whatsapp" className="mb-1.5 block text-xs">
                  WhatsApp number
                </Label>
                <input
                  id="whatsapp"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className={inputCls}
                />
              </div>

              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={prefs.whatsapp.enabled}
                  onChange={(e) =>
                    setPrefs((p) => ({
                      ...p,
                      whatsapp: { ...p.whatsapp, enabled: e.target.checked },
                    }))
                  }
                  className="h-4 w-4 rounded border-input"
                />
                <span>
                  Enable WhatsApp notifications
                  <span className="block text-xs text-muted-foreground">
                    Requires a WhatsApp number above. Standard messaging rates may apply.
                  </span>
                </span>
              </label>

              <div className="ml-7 space-y-2">
                <label className="flex items-center gap-3 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    disabled={!prefs.whatsapp.enabled}
                    checked={prefs.whatsapp.applicationUpdates}
                    onChange={(e) =>
                      setPrefs((p) => ({
                        ...p,
                        whatsapp: { ...p.whatsapp, applicationUpdates: e.target.checked },
                      }))
                    }
                    className="h-4 w-4 rounded border-input"
                  />
                  Application status updates
                </label>
                <label className="flex items-center gap-3 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    disabled={!prefs.whatsapp.enabled}
                    checked={prefs.whatsapp.newMatches}
                    onChange={(e) =>
                      setPrefs((p) => ({
                        ...p,
                        whatsapp: { ...p.whatsapp, newMatches: e.target.checked },
                      }))
                    }
                    className="h-4 w-4 rounded border-input"
                  />
                  New matching internships
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data security */}
      <DataSecurityCard />
    </div>
  );
}
