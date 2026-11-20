'use client';

import Link from 'next/link';
import { Target, Sparkles, ShieldCheck, Users, Rocket, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/layout/public-header';
import { Footer } from '@/components/layout/footer';

const VALUES = [
  {
    icon: Target,
    title: 'Explainable, not a black box',
    desc: 'Every match comes with a transparent score so students know exactly why an internship fits — and what to improve.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust first',
    desc: 'Every company is admin-verified before it can post, so students apply with confidence instead of chasing scams.',
  },
  {
    icon: Sparkles,
    title: 'Potential over pedigree',
    desc: 'We score skills, projects and growth trajectory — built for first-time applicants, not just polished résumés.',
  },
];

const STATS = [
  { value: '10K+', label: 'Students matched' },
  { value: '500+', label: 'Verified companies' },
  { value: '2.5K+', label: 'Internships posted' },
  { value: '4.7/5', label: 'Average rating' },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader active="About us" />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 text-white">
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-6 pb-24 pt-20 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-300">
              <Heart className="h-3.5 w-3.5" /> About us
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
              Bridging students{' '}
              <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                into their first opportunity
              </span>
            </h1>
            <p className="mt-5 text-lg text-slate-400">
              CareerSync is an AI-powered internship discovery & matching platform built to help
              early-career students find roles they&apos;re actually a fit for — and help
              companies hire them faster.
            </p>
          </div>
        </section>

        {/* Stats strip */}
        <section className="relative z-10 mx-auto -mt-12 max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-5 rounded-2xl border bg-card p-8 shadow-lg sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Why we started CareerSync</h2>
          <p className="mt-4 text-muted-foreground">
            Finding a first internship is hard when every posting asks for experience you can&apos;t
            get without one. We built CareerSync so students are matched on skills, projects and
            potential — not just keywords on a résumé — and so companies spend less time sifting
            through unqualified applicants and more time meeting the right ones.
          </p>
        </section>

        {/* Values */}
        <section className="border-t bg-muted/30 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">What we stand for</h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {VALUES.map((v) => (
                <div key={v.title} className="rounded-2xl border bg-card p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Rocket className="h-5 w-5" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Ready to get started?</h2>
          <p className="mt-3 text-muted-foreground">
            Join as a student to find your next internship, or as a company to hire faster.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/register">Get started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                <Users className="mr-1.5 h-4 w-4" /> Talk to us
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
