'use client';

import {
  GraduationCap,
  TrendingUp,
  Palette,
  BrainCircuit,
  Smartphone,
  Cloud,
  PenTool,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react';

const LEFT = [
  { icon: GraduationCap, title: 'Frontend Developer', company: 'TechStart Labs', score: 93, delay: '0s' },
  { icon: Palette, title: 'UI/UX Design', company: 'PixelWorks', score: 88, delay: '1.2s' },
  { icon: Smartphone, title: 'Mobile App', company: 'AppNest', score: 84, delay: '2s' },
  { icon: Cloud, title: 'Cloud Engineer', company: 'SkyOps', score: 79, delay: '2.8s' },
];

const RIGHT = [
  { icon: TrendingUp, title: 'Python Backend', company: 'DataForge', score: 81, delay: '0.6s' },
  { icon: BrainCircuit, title: 'Data Science', company: 'InsightAI', score: 76, delay: '1.6s' },
  { icon: PenTool, title: 'Product Design', company: 'FormLab', score: 90, delay: '2.4s' },
  { icon: FlaskConical, title: 'ML Research', company: 'NeuralHub', score: 72, delay: '3.2s' },
];

/**
 * Full-page animated background for the login page: drifting gradient blobs
 * plus two evenly-spaced columns of floating "match" cards down each side.
 * Purely decorative (pointer-events disabled) so the centered sign-in card
 * sits cleanly on top. Self-contained CSS — no third-party embed.
 */
export function AuthAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      {/* drifting gradient blobs */}
      <span className="anim-float-a absolute -left-24 -top-16 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <span className="anim-float-b absolute -right-16 top-1/4 h-80 w-80 rounded-full bg-violet-400/25 blur-3xl" />
      <span className="anim-float-a absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
      <span className="anim-float-b absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />

      {/* Left column — evenly distributed, fully visible */}
      <div className="absolute inset-y-0 left-6 hidden flex-col justify-evenly py-8 xl:flex">
        {LEFT.map((c, i) => (
          <MiniCard key={c.title} {...c} className={i % 2 === 1 ? 'ml-8' : ''} />
        ))}
      </div>

      {/* Right column — right-aligned, evenly distributed */}
      <div className="absolute inset-y-0 right-6 hidden flex-col items-end justify-evenly py-8 xl:flex">
        {RIGHT.map((c, i) => (
          <MiniCard key={c.title} {...c} className={i % 2 === 1 ? 'mr-8' : ''} />
        ))}
      </div>
    </div>
  );
}

function MiniCard({
  className,
  icon: Icon,
  title,
  company,
  score,
  delay,
}: {
  className?: string;
  icon: LucideIcon;
  title: string;
  company: string;
  score: number;
  delay: string;
}) {
  return (
    <div
      className={`anim-float-card flex w-56 items-center gap-3 rounded-xl border border-black/5 bg-white/80 p-3 shadow-lg backdrop-blur ${className ?? ''}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{company}</p>
      </div>
      <div className="relative shrink-0">
        <span className="anim-ring absolute inset-0 rounded-full bg-emerald-400/40" />
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
          {score}%
        </span>
      </div>
    </div>
  );
}
