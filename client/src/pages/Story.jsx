import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home as HomeIcon,
  User,
  Sparkles,
  Mail,
  ArrowUpRight,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { cn } from '@/lib/utils';

const HEADLINES = ['Match Talent', 'Bridge The Gap', 'Hire Faster', 'Grow Real Skills'];

// Types a phrase out, holds it, deletes it, then moves to the next — no
// library needed, just a self-scheduling timeout loop.
function useTypewriter(phrases, { typeMs = 65, deleteMs = 35, holdMs = 1600, pauseMs = 350 } = {}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[index % phrases.length];
    let delay = deleting ? deleteMs : typeMs;

    if (!deleting && text === current) delay = holdMs;
    if (deleting && text === '') delay = pauseMs;

    const timer = setTimeout(() => {
      if (!deleting && text === current) {
        setDeleting(true);
        return;
      }
      if (deleting && text === '') {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
        return;
      }
      setText(current.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, phrases, typeMs, deleteMs, holdMs, pauseMs]);

  return text;
}

const NAV = [
  { label: 'Home', href: '/', icon: HomeIcon, active: true },
  { label: 'About', href: '/about', icon: User },
  { label: 'Features', href: '/#features', icon: Sparkles },
  { label: 'Contact', href: '/contact', icon: Mail },
];

const STATS = [
  { value: '10K+', label: 'Students matched' },
  { value: '500+', label: 'Verified companies' },
  { value: '4.7/5', label: 'Average rating' },
];

const TICKER = [
  'AI Matching',
  'Skill-Gap Analysis',
  'Verified Hiring',
  'Resume Intelligence',
  'Hiring Pipeline',
  'Real-Time Chat',
];

export default function StoryPage() {
  const headline = useTypewriter(HEADLINES);
  const heroRef = useRef(null);

  // Cursor-tracking spotlight on the hero background — writes straight to the
  // DOM (no React state) so it stays cheap on every mousemove.
  const handlePointerMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <main className="flex-1">
        <section
          ref={heroRef}
          onMouseMove={handlePointerMove}
          className="relative overflow-hidden"
          style={{ '--mx': '50%', '--my': '20%' }}
        >
          {/* TEMP DIAGNOSTIC: solid, unmissable stripes — no mask, no transform,
              no low opacity. If this doesn't show up, the problem isn't the
              gradient math, it's something more fundamental about this element
              reaching the screen at all. */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, red 0 20px, yellow 20px 40px)' }}
            aria-hidden="true"
          />
          <div className="anim-drift-2 pointer-events-none absolute -right-10 bottom-10 -z-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
          {/* Background image that hovers with the cursor — a soft radial spotlight
              following the pointer across the whole hero, same idea as the
              landing page's spotlight cards. */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 transition-[background] duration-150"
            style={{
              backgroundImage:
                'radial-gradient(500px circle at var(--mx) var(--my), hsl(var(--primary) / 0.16), transparent 60%)',
            }}
            aria-hidden="true"
          />

          <div className="mx-auto max-w-7xl px-6 pb-16 pt-8">
            {/* Bespoke pill header — distinct one-off style, not the site's usual nav */}
            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
                <Sparkles className="h-5 w-5 text-primary" />
                Portfolio
              </Link>

              <nav className="hidden items-center gap-1 rounded-full border bg-white/80 p-1.5 shadow-sm backdrop-blur md:flex">
                {NAV.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      item.active
                        ? 'bg-primary text-primary-foreground shadow'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>

              <p className="font-signature text-2xl text-slate-800 sm:text-3xl">InternBridge</p>
            </div>

            {/* Intro line + CTA, right-aligned like the reference */}
            <div className="mt-6 flex justify-end">
              <div className="max-w-sm text-right">
                <p className="text-sm text-slate-600">
                  Hi, we&apos;re InternBridge. We bridge ambitious students with verified companies
                  through explainable AI matching.
                </p>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition-colors hover:border-primary hover:text-primary"
                >
                  Get in touch <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Layered headline + centerpiece + stat rail */}
            <div className="relative mt-10 grid items-center gap-8 lg:grid-cols-[220px_1fr]">
              {/* Stat rail */}
              <div className="order-2 space-y-6 divide-y divide-slate-200 lg:order-1">
                {STATS.map((s, i) => (
                  <div key={s.label} className={i > 0 ? 'pt-6' : ''}>
                    <p className="text-4xl font-bold text-primary">{s.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Centerpiece */}
              <div className="relative order-1 flex min-h-[26rem] items-end justify-center overflow-visible lg:order-2">
                {/* Ghost background text */}
                <p
                  aria-hidden="true"
                  className="absolute inset-x-0 top-2 select-none text-center text-5xl font-extrabold tracking-tight text-slate-900/10 sm:text-7xl"
                >
                  WE EXIST TO
                </p>
                {/* Outlined headline, sitting behind the avatar like the reference — cycles
                    through phrases via a typewriter effect (type, hold, delete, repeat) */}
                <h1 className="absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none whitespace-nowrap text-center text-4xl font-extrabold uppercase tracking-tight text-transparent [-webkit-text-stroke:1.5px_theme(colors.primary.DEFAULT)] sm:text-6xl lg:text-7xl">
                  {headline}
                  <span className="inline-block animate-pulse text-primary [-webkit-text-stroke:0]">|</span>
                </h1>

                {/* Illustrated "student" persona standing in for a photo avatar.
                    Lifts slightly and the glow behind it brightens on hover. */}
                <div className="group relative z-10">
                  <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
                  <img
                    src="/avatar.jpeg"
                    alt=""
                    className="anim-bob h-64 w-auto object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-105 sm:h-80"
                  />
                </div>

                <span className="anim-float-a absolute right-2 top-8 z-20 flex h-11 w-11 items-center justify-center rounded-2xl border bg-white text-primary shadow-lg sm:right-10">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="anim-float-c absolute left-2 bottom-16 z-20 flex h-11 w-11 items-center justify-center rounded-2xl border bg-white text-primary shadow-lg sm:left-10">
                  <Target className="h-5 w-5" />
                </span>
              </div>
            </div>
          </div>

          {/* Scrolling ticker ribbon */}
          <div className="relative -rotate-1 overflow-hidden border-y-2 border-primary/20 bg-gradient-to-r from-primary to-indigo-700 py-4">
            <div className="anim-marquee flex w-max items-center gap-10 whitespace-nowrap">
              {[...TICKER, ...TICKER].map((label, i) => (
                <span key={i} className="flex items-center gap-10">
                  <span className="text-lg font-extrabold uppercase tracking-wide text-white">{label}</span>
                  <span aria-hidden="true" className="text-white/70">✦</span>
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
