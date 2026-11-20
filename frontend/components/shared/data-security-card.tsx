import { ShieldCheck, Shield, Lock, Eye, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';

const ITEMS = [
  { icon: Shield, title: '256-bit Encryption', desc: 'Your data is encrypted at rest and in transit.' },
  { icon: Lock, title: 'Secure Cloud Storage', desc: 'Certified infrastructure with strict access controls.' },
  { icon: Eye, title: 'Privacy Protected', desc: 'Your data is only shared with your explicit consent.' },
  { icon: Globe, title: 'DigiLocker Compatible', desc: "Works with India's official DigiLocker platform." },
];

/** Reusable "Your Data is Secure" trust card shown across all user portals. */
export function DataSecurityCard() {
  return (
    <Card className="overflow-hidden">
      {/* Dark header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-4 text-white">
        <p className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="h-5 w-5 text-emerald-400" /> Your Data is Secure
        </p>
        <p className="mt-0.5 text-sm text-slate-300">Government-grade security standards</p>
      </div>

      {/* Feature grid */}
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        {ITEMS.map((it) => (
          <div key={it.title} className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <it.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="font-semibold">{it.title}</p>
              <p className="text-sm text-muted-foreground">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
