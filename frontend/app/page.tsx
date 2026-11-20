'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  Sparkles,
  Target,
  ShieldCheck,
  BarChart3,
  Search,
  Briefcase,
  Users,
  Zap,
  GitBranch,
  Award,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  Building2,
  FileText,
  Code2,
  Database,
  Megaphone,
  PenTool,
  Clock,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GlowCard } from '@/components/ui/spotlight-card';
import { PublicHeader } from '@/components/layout/public-header';
import { Footer } from '@/components/layout/footer';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types';
import { ROLE_HOME } from '@/constants';

const FEATURES = [
  { icon: Target, title: 'Explainable AI matching', desc: 'Every match comes with a transparent score across skill coverage, proficiency fit and project relevance.' },
  { icon: Sparkles, title: 'Skill-gap analysis', desc: 'See exactly which skills to learn next for your target role, with a personalised learning path.' },
  { icon: Briefcase, title: 'Streamlined hiring', desc: 'Companies manage applicants on a Kanban pipeline from applied to hired in a few clicks.' },
  { icon: ShieldCheck, title: 'Verified companies', desc: 'Admin-verified employers so students only apply to legitimate opportunities.' },
  { icon: Search, title: 'Powerful discovery', desc: 'Filter by skills, stipend, city, remote and eligibility — and save what you love.' },
  { icon: BarChart3, title: 'Insightful analytics', desc: 'Funnels, match scores and growth metrics for students, companies and admins alike.' },
];

// Company logo wall — logos load from the Clearbit logo CDN by domain, with a
// graceful initial-badge fallback if a logo can't be fetched.
const COMPANIES = [
  { name: 'Google', domain: 'google.com' },
  { name: 'Microsoft', domain: 'microsoft.com' },
  { name: 'Amazon', domain: 'amazon.com' },
  { name: 'Apple', domain: 'apple.com' },
  { name: 'Meta', domain: 'meta.com' },
  { name: 'IBM', domain: 'ibm.com' },
  { name: 'Oracle', domain: 'oracle.com' },
  { name: 'Adobe', domain: 'adobe.com' },
  { name: 'Salesforce', domain: 'salesforce.com' },
  { name: 'NVIDIA', domain: 'nvidia.com' },
  { name: 'Intel', domain: 'intel.com' },
  { name: 'Cisco', domain: 'cisco.com' },
  { name: 'SAP', domain: 'sap.com' },
  { name: 'Accenture', domain: 'accenture.com' },
  { name: 'Infosys', domain: 'infosys.com' },
  { name: 'TCS', domain: 'tcs.com' },
  { name: 'Wipro', domain: 'wipro.com' },
  { name: 'HCLTech', domain: 'hcltech.com' },
  { name: 'Samsung', domain: 'samsung.com' },
  { name: 'GitHub', domain: 'github.com' },
];

const COMPANY_POINTS = [
  { icon: Zap, title: 'Post in minutes', desc: 'Publish an internship with structured skill requirements and reach motivated early-career talent instantly.' },
  { icon: Users, title: 'Pre-screened shortlists', desc: 'AI ranks applicants by match score, so you review a short, relevant list instead of a flood — cut screening effort by up to 60%.' },
  { icon: GitBranch, title: 'Hiring pipeline', desc: 'Move candidates through Applied → Shortlisted → Interview → Hired on a clean Kanban board.' },
  { icon: MessageSquare, title: 'Chat & interviews', desc: 'Message candidates in real time and schedule interviews with calendar invites, all in one place.' },
  { icon: Award, title: 'Issue certificates', desc: 'Give verified completion certificates your interns can share and employers can authenticate.' },
  { icon: BarChart3, title: 'Hiring analytics', desc: 'Track funnel conversion, time-to-fill and applicant quality to hire smarter over time.' },
];

const CANDIDATE_PREVIEWS = [
  { initial: 'A', line1: 'B.Tech, Computer Science', line2: 'React · Node.js · Python', match: '96% match' },
  { initial: 'R', line1: 'BBA, Marketing', line2: 'SEO · Content · Analytics', match: '91% match' },
  { initial: 'S', line1: 'M.Sc, Data Science', line2: 'Python · SQL · ML', match: '88% match' },
];

const SKILL_COURSES = [
  {
    icon: Code2,
    title: 'Web Development',
    gradient: 'from-blue-600 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=70',
    points: ['Master 8+ in-demand tools', 'AI-reviewed practice projects', 'Priority in AI matching for dev roles'],
  },
  {
    icon: Database,
    title: 'Data Science',
    gradient: 'from-emerald-600 to-teal-600',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=70',
    points: ['Master 10+ in-demand tools', 'Hands-on with real datasets', 'Priority in AI matching for data roles'],
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    gradient: 'from-rose-600 to-pink-600',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=70',
    points: ['Master 8+ in-demand tools', 'Real campaign case studies', 'Priority in AI matching for marketing roles'],
  },
  {
    icon: PenTool,
    title: 'UI/UX Design',
    gradient: 'from-violet-600 to-purple-600',
    image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=600&q=70',
    points: ['Master 7+ in-demand tools', 'Portfolio-ready projects', 'Priority in AI matching for design roles'],
  },
];

const CERT_COURSES = [
  { title: 'Artificial Intelligence & Machine Learning', weeks: 6, tag: 'Trending', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=500&q=70' },
  { title: 'Full Stack Web Development', weeks: 8, tag: 'Most popular', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&q=70' },
  { title: 'Programming in Python', weeks: 6, tag: 'Beginner friendly', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=500&q=70' },
  { title: 'Complete Digital Marketing', weeks: 8, tag: 'Trending', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=70' },
  { title: 'UI/UX Design Fundamentals', weeks: 5, tag: 'New', image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=500&q=70' },
  { title: 'Data Analytics with SQL & Excel', weeks: 6, tag: 'Beginner friendly', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=70' },
];

// Animated stat counters.
const STATS = [
  { value: 50000, suffix: '+', label: 'Students on board' },
  { value: 2000, suffix: '+', label: 'Verified companies' },
  { value: 10000, suffix: '+', label: 'Internships posted' },
  { value: 95, suffix: '%', label: 'Match accuracy' },
];

// How it works — 3-step flow.
const HOW_STEPS = [
  { icon: FileText, title: 'Build your profile', desc: 'Add your skills, projects and resume — or generate one in minutes with our AI resume builder.' },
  { icon: Sparkles, title: 'Get matched by AI', desc: 'See explainable match scores on every internship and know exactly why you fit — and what to improve.' },
  { icon: CheckCircle2, title: 'Apply & get hired', desc: 'Apply in one click, track your pipeline, and land the internship that actually fits you.' },
];

// Resume Intelligence process — 3-panel illustrated showcase inside the
// "No resume? No problem" section, each with a small built-in mockup.
const RESUME_HOW_IT_WORKS = [
  {
    icon: UploadCloud,
    badge: 'Uploading…',
    badgeColor: 'text-primary',
    title: 'Upload or start fresh',
    desc: 'Drop your existing resume — PDF or DOCX — or begin from a blank slate in seconds.',
  },
  {
    icon: Sparkles,
    badge: 'Analyzing…',
    badgeColor: 'text-emerald-600',
    title: 'AI scores every section',
    desc: 'Get an ATS score with a category-by-category breakdown, generated instantly.',
  },
  {
    icon: CheckCircle2,
    badge: 'Ready',
    badgeColor: 'text-primary',
    title: 'Fix and apply with confidence',
    desc: 'Work through prioritized, actionable suggestions, then apply knowing it’s ready.',
  },
];

// Student success stories (placement testimonials).
const TESTIMONIALS = [
  { name: 'Yogesh Singh', placed: 'Placed at Flipkart', quote: 'I landed my first internship through CareerSync. The AI match scores showed me exactly which roles fit me — a must-have for any student building a career.' },
  { name: 'Priya Menon', placed: 'Hired at Amazon', quote: 'I wanted to break into tech from a non-CS background. The skill-gap analysis told me what to learn, and I could explain those concepts confidently in my interviews.' },
  { name: 'Aditya Rao', placed: 'Interning at Zoho', quote: 'I had no idea where to start. CareerSync guided the whole journey — building the right skills and confidence — and I secured an internship within weeks.' },
  { name: 'Sneha Kapoor', placed: 'Placed at Deloitte', quote: 'The resume review gave me an ATS score and a clear list of fixes. After applying them, my callbacks went up dramatically. Genuinely game-changing.' },
];

// Recognition / partner bodies — rendered as branded wordmark tiles (official
// logos can't be reliably fetched and shouldn't be reproduced without rights).
const PARTNERS = [
  { name: 'Skill India', gradient: 'from-orange-500 to-green-600' },
  { name: 'NSDC', gradient: 'from-blue-600 to-blue-800' },
  { name: 'AICTE', gradient: 'from-red-700 to-rose-800' },
  { name: 'NIELIT', gradient: 'from-sky-600 to-blue-700' },
  { name: 'NASSCOM', gradient: 'from-indigo-600 to-blue-700' },
  { name: 'UGC', gradient: 'from-amber-600 to-red-700' },
];

// Full-bleed hero background slideshow — auto-rotates. Unsplash (verified IDs).
const HERO_SLIDES = [
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=80',
];

// Photo gallery — Unsplash stock images (known-good IDs), served via next/image.
const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80', alt: 'Student working on a laptop', caption: 'Build real projects' },
  { src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80', alt: 'Team collaborating around a table', caption: 'Join great teams' },
  { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', alt: 'Code on a screen', caption: 'Grow your skills' },
  { src: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=800&q=80', alt: 'Colleagues celebrating together', caption: 'Get hired' },
];

const FAQS = [
  { q: 'Is CareerSync free for students?', a: 'Yes. Searching, applying, AI match scores, skill-gap analysis and the resume review are always free for students.' },
  { q: 'Do I need experience to apply?', a: 'No. We score potential and projects, not just credentials — it’s built for 1st/2nd-year students and beginners breaking in.' },
  { q: 'How does the AI matching work?', a: 'Every internship gets an explainable score across skill coverage, proficiency fit, project relevance and eligibility — so you know exactly why you match.' },
  { q: 'Who can post internships?', a: 'Only admin-verified companies. Verification keeps out fake postings and fee-charging scams, so students apply with confidence.' },
  { q: 'How do companies find me?', a: 'Turn on “candidate discovery” in Settings and verified companies can surface your profile in candidate search based on your skills.' },
  { q: 'How do I improve my chances?', a: 'Complete your profile, add projects and skills, and run the AI Resume Intelligence review for an ATS score and prioritized fixes.' },
];

export default function LandingPage() {
  const user = useAuthStore((s) => s.user);

  // `/student/search` is a student-only route. Send students there directly,
  // other signed-in roles to their own home, and guests to register.
  const browseHref = user
    ? user.role === UserRole.STUDENT
      ? '/student/search'
      : ROLE_HOME[user.role]
    : '/register';

  // Auto-rotating hero background — advances every 5s, crossfading between slides.
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero — full-bleed auto-rotating background slideshow */}
        <section className="relative flex min-h-[34rem] items-center overflow-hidden border-b lg:min-h-[40rem]">
          {/* Slideshow images (crossfade) */}
          <div className="absolute inset-0" aria-hidden="true">
            {HERO_SLIDES.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className={cn(
                  'object-cover transition-opacity duration-1000 ease-in-out',
                  i === slide ? 'opacity-100' : 'opacity-0'
                )}
              />
            ))}
            {/* Dark scrim for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/60 to-slate-900/40" />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 text-center text-white lg:text-left">
            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur">
              <Sparkles className="h-4 w-4" />
              AI-powered internship discovery &amp; matching
            </span>
            <h1 className="animate-fade-up mt-6 max-w-3xl text-4xl font-extrabold tracking-tight drop-shadow-lg [animation-delay:100ms] sm:text-6xl">
              Find the internship that actually <span className="text-sky-300">fits you</span>.
            </h1>
            <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg text-white/85 drop-shadow [animation-delay:200ms] lg:mx-0">
              CareerSync matches students to internships with explainable AI, highlights the
              skills you need next, and gives companies a clean hiring pipeline.
            </p>
            <div className="animate-fade-up mt-10 flex flex-col justify-center gap-3 [animation-delay:300ms] sm:flex-row lg:justify-start">
              <Button size="lg" asChild>
                <Link href={user ? ROLE_HOME[user.role] : '/register'}>
                  {user ? 'Go to your dashboard' : 'Create your account'} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white">
                <Link href={browseHref}>Browse internships</Link>
              </Button>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i === slide ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                )}
              />
            ))}
          </div>
        </section>

        {/* Company logo wall — 3 per row */}
        <section className="relative overflow-hidden border-b bg-sky-50/80 dark:bg-sky-950/20">
          <SectionBg src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80" />
          <div className="relative mx-auto max-w-6xl px-6 py-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium uppercase tracking-wide text-primary">
                Trusted by talent going to top companies
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Intern at companies you admire
              </h2>
              <p className="mt-3 text-muted-foreground">
                From global tech giants to fast-growing startups — {COMPANIES.length}+ companies and counting.
              </p>
            </div>
            <Reveal className="mt-10">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {COMPANIES.map((c) => (
                  <CompanyLogo key={c.domain} name={c.name} domain={c.domain} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-b bg-blue-100/50 dark:bg-blue-950/25">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Everything you need to bridge the gap</h2>
              <p className="mt-3 text-muted-foreground">Built for students, companies and administrators.</p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 80}>
                  <GlowCard customSize variant="light" glowColor="blue" className="group h-full w-full">
                    <div className="flex flex-col p-2">
                      <div className="mb-4 inline-flex w-fit rounded-lg bg-primary/10 p-3 text-primary transition-transform duration-200 group-hover:scale-110">
                        <f.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold">{f.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </GlowCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Resume Intelligence — flow-chart showcase */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-sky-50/50 to-background dark:via-sky-950/20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Left: copy + CTAs */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-4 w-4" /> Resume Intelligence
              </span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Turn your resume into <span className="text-primary">interview-ready</span>.
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Upload your resume for an instant ATS score and a prioritized fix list. Don&apos;t have
                one yet? Generate a clean, recruiter-ready resume in minutes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/student/resume/build">Build my resume <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/student/resume">Analyze my resume</Link>
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> ATS score</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Skill-gap analysis</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> One-click fixes</span>
              </div>
            </div>

            {/* Right: flow diagram (desktop) */}
            <div className="relative hidden h-[460px] lg:block">
              {/* Dotted connectors */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 600 460" fill="none" preserveAspectRatio="none" aria-hidden="true">
                <g stroke="hsl(var(--primary) / 0.45)" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round">
                  <path d="M330,215 C270,240 220,250 175,255" />
                  <path d="M340,225 C260,270 180,290 120,300" />
                  <path d="M345,235 C280,300 220,345 190,360" />
                  <path d="M335,230 C230,305 130,355 85,380" />
                  <path d="M395,185 C425,160 445,140 465,122" />
                  <path d="M490,108 C515,92 535,78 555,62" />
                </g>
              </svg>

              {/* Central resume node */}
              <div className="absolute left-[60%] top-[43.5%] -translate-x-1/2 -translate-y-1/2">
                <span className="anim-pulse-ring absolute inset-0 rounded-3xl bg-primary/30" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-2xl shadow-primary/30">
                  <FileText className="h-11 w-11" />
                </div>
              </div>

              {/* App tiles (lower-left cluster) */}
              {[
                { icon: FileText, color: 'text-sky-500', pos: 'left-[15%] top-[65%]' },
                { icon: BarChart3, color: 'text-violet-500', pos: 'left-[10%] top-[83%]' },
                { icon: Target, color: 'text-rose-500', pos: 'left-[28%] top-[78%]' },
                { icon: CheckCircle2, color: 'text-emerald-500', pos: 'left-[25%] top-[54%]' },
              ].map((t, i) => (
                <div key={i} className={cn('anim-bob absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border bg-card shadow-lg', t.pos)}>
                  <t.icon className={cn('h-6 w-6', t.color)} />
                </div>
              ))}

              {/* Chain nodes (upper-right) */}
              <div className="absolute left-[78%] top-[26%] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card px-3 py-2 shadow-lg">
                <p className="flex items-center gap-1.5 text-xs font-medium"><Search className="h-3.5 w-3.5 text-primary" /> Parse & score</p>
              </div>
              <div className="absolute left-[93%] top-[13%] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card px-3 py-2 shadow-lg">
                <p className="flex items-center gap-1.5 text-xs font-medium"><Sparkles className="h-3.5 w-3.5 text-primary" /> Fixes</p>
              </div>

              {/* ATS score chip near the center */}
              <div className="absolute left-[80%] top-[52%] flex -translate-y-1/2 items-center gap-2 rounded-xl border bg-card px-3 py-2 shadow-lg">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-600">82</span>
                <div>
                  <p className="text-xs font-semibold leading-none">ATS score</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Good resume</p>
                </div>
              </div>

              {/* Bottom input — pinned bottom-right, clear of the left tile cluster */}
              <div className="absolute bottom-2 right-0 flex w-80 items-center gap-2 rounded-full border bg-card px-4 py-2.5 shadow-lg">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm text-muted-foreground">Ask about your resume…</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><ArrowRight className="h-4 w-4" /></span>
              </div>
            </div>

            {/* Mobile: simple stacked cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
              <div className="rounded-2xl border bg-card p-5 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><BarChart3 className="h-5 w-5" /></span>
                <p className="mt-3 font-semibold">Resume analytics</p>
                <p className="mt-1 text-sm text-muted-foreground">Instant ATS score with a category-by-category breakdown and fixes.</p>
              </div>
              <div className="rounded-2xl border bg-card p-5 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileText className="h-5 w-5" /></span>
                <p className="mt-3 font-semibold">No resume? Build one</p>
                <p className="mt-1 text-sm text-muted-foreground">Answer a few questions and generate a clean PDF resume in minutes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative overflow-hidden border-b bg-sky-50/80 dark:bg-sky-950/20">
          <div className="relative mx-auto max-w-7xl px-6 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
                <Zap className="anim-wiggle h-4 w-4 text-primary" /> How it works
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">Land your internship in 3 simple steps</h2>
              <p className="mt-3 text-muted-foreground">From zero to hired — no guesswork.</p>
            </div>
            <div className="relative mt-14 grid gap-8 md:grid-cols-3">
              {/* Connecting line on desktop */}
              <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" aria-hidden="true" />
              {HOW_STEPS.map((s, i) => (
                <Reveal key={s.title} delay={i * 120}>
                  <div className="relative flex flex-col items-center text-center">
                    <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-500 text-white shadow-lg">
                      <span className="anim-pulse-ring absolute inset-0 rounded-2xl bg-primary/40" />
                      <s.icon className="relative h-7 w-7" />
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-card text-xs font-bold text-primary shadow">
                        {i + 1}
                      </span>
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats counter band */}
        <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary to-indigo-700 text-white">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="anim-drift-1 absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="anim-drift-2 absolute -bottom-16 -right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-white/80">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For employers — dark premium banner */}
        <section className="relative overflow-hidden border-y border-white/10 bg-slate-950 text-white">
          {/* Ambient glow + grid */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 bg-hero-grid opacity-30" />
            <div className="anim-drift-1 absolute -left-20 top-0 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
            <div className="anim-drift-2 absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium backdrop-blur">
                <Building2 className="h-4 w-4 text-primary" /> CareerSync for employers
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                Looking to hire freshers and interns?
              </h2>
              <p className="mt-4 max-w-lg text-slate-300">
                Post a role in minutes and reach students AI-matched to your skill requirements —
                a short, relevant shortlist, not a résumé flood.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/register?role=company">Post now for free <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:text-white">
                  <Link href="/#companies">See how it works</Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={120} className="mx-auto w-full max-w-sm space-y-3">
              {CANDIDATE_PREVIEWS.map((c, i) => (
                <div
                  key={c.initial}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-xl backdrop-blur transition-transform hover:-translate-y-0.5"
                  style={{ marginLeft: `${i * 14}px` }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 text-sm font-bold text-white">
                    {c.initial}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{c.line1}</p>
                    <p className="truncate text-xs text-slate-400">{c.line2}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                    {c.match}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* For companies */}
        {/* For companies — intro + image (band 1) */}
        <section id="companies" className="relative overflow-hidden border-t bg-blue-100/50 dark:bg-blue-950/25">
          <SectionBg src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80" />
          <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-20">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 text-primary" /> For companies
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">Hire motivated interns, faster</h2>
              <p className="mt-3 text-muted-foreground">
                Reach early-career talent, screen less, and manage the whole pipeline in one place.
              </p>
            </div>

            <div className="relative mx-auto mt-10 aspect-[21/9] w-full max-w-5xl overflow-hidden rounded-2xl border shadow-xl ring-1 ring-black/5">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
                alt="A company team reviewing candidates"
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* For companies — benefit cards + CTA (band 2, different background) */}
        <section className="border-b bg-sky-50/80 dark:bg-sky-950/20">
          <div className="mx-auto max-w-7xl px-6 pb-20 pt-14">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {COMPANY_POINTS.map((p, i) => (
                <Reveal key={p.title} delay={i * 70}>
                  <GlowCard customSize variant="light" glowColor="blue" className="group h-full w-full">
                    <div className="flex gap-4 p-1">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110">
                        <p.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{p.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                      </div>
                    </div>
                  </GlowCard>
                </Reveal>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button size="lg" asChild>
                <Link href="/register?role=company">
                  Post an internship <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* No resume? No problem — AI resume builder CTA */}
        <section className="relative overflow-hidden border-b bg-[#050f9c]">
          {/* Geometric interlace pattern background */}
          <div
            className="absolute inset-0 opacity-90"
            style={{ backgroundImage: 'url(/patterns/interbridge-geo.svg)', backgroundSize: '120px 120px' }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-6 py-20">
            <Reveal>
              <GlowCard customSize variant="light" glowColor="purple" className="w-full">
                <div className="grid items-center gap-10 p-4 sm:p-8 lg:grid-cols-2">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 text-primary" /> AI Resume Intelligence
                    </span>
                    <h2 className="mt-5 text-3xl font-bold tracking-tight">No resume? No problem.</h2>
                    <p className="mt-3 text-muted-foreground">
                      Upload what you have — or start from scratch — and let AI Resume Intelligence
                      score it and tell you exactly what to fix next.
                    </p>
                    <ul className="mt-6 space-y-3 text-sm">
                      {[
                        'ATS score with a category-by-category breakdown',
                        'Prioritized, actionable suggestions',
                        'Built for early-career profiles, not just executives',
                      ].map((point) => (
                        <li key={point} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <Button size="lg" className="mt-8" asChild>
                      <Link href={user?.role === UserRole.STUDENT ? '/student/resume' : '/register'}>
                        Build my resume <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="relative mx-auto w-full max-w-sm">
                    <div className="rounded-2xl border bg-background p-6 shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-2xl font-bold text-emerald-600">
                          82
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-2.5 w-4/5 rounded-full bg-muted" />
                          <div className="h-2.5 w-3/5 rounded-full bg-muted" />
                          <div className="h-2.5 w-2/3 rounded-full bg-muted" />
                        </div>
                      </div>
                      <div className="mt-6 space-y-2">
                        <div className="h-2 w-full rounded-full bg-muted" />
                        <div className="h-2 w-11/12 rounded-full bg-muted" />
                        <div className="h-2 w-4/5 rounded-full bg-muted" />
                      </div>
                    </div>
                    <div className="absolute -bottom-5 -left-5 flex items-center gap-2 rounded-xl border bg-card px-4 py-3 shadow-lg">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs font-semibold">AI suggestion</p>
                        <p className="text-xs text-muted-foreground">Quantify your project impact</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </Reveal>
          </div>
        </section>

        {/* How AI Resume Intelligence works — separate band, different background */}
        <section className="border-b bg-sky-50/80 dark:bg-sky-950/20">
          <div className="mx-auto max-w-6xl px-6 py-20">
            {/* How resume intelligence works — 3-panel illustrated showcase */}
            <Reveal delay={120}>
              <div className="mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                  <span className="h-1.5 w-1.5 rounded-sm bg-primary" /> How it works
                </span>
                <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  How AI Resume Intelligence works
                </h3>
                <p className="mt-3 text-muted-foreground">
                  A simple, guided process that turns any resume into an interview-ready one.
                </p>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-3">
                {RESUME_HOW_IT_WORKS.map((s, i) => (
                  <GlowCard key={s.title} customSize variant="light" glowColor="purple" className="h-full w-full">
                    <div className="flex flex-col gap-4 p-1">
                      <div className="relative flex h-36 items-center justify-center overflow-hidden rounded-xl bg-muted/50 dark:bg-muted/10">
                        <div className="absolute inset-0 bg-hero-grid opacity-30" aria-hidden="true" />
                        <span className={cn('absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background px-2 py-1 text-[10px] font-semibold shadow', s.badgeColor)}>
                          <s.icon className="h-3 w-3" /> {s.badge}
                        </span>

                        {i === 0 && (
                          <div className="relative flex h-16 w-28 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-primary/40 bg-background">
                            <FileText className="h-6 w-6 text-primary" />
                            <div className="h-1.5 w-14 rounded-full bg-muted" />
                          </div>
                        )}
                        {i === 1 && (
                          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-2xl font-bold text-emerald-600">
                            82
                          </div>
                        )}
                        {i === 2 && (
                          <div className="relative w-32 space-y-1.5 rounded-lg border bg-background p-2.5 shadow-sm">
                            <div className="flex items-center gap-1.5 text-[11px] font-medium">
                              <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" /> Quantify impact
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-medium">
                              <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" /> Add keywords
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                              <CheckCircle2 className="h-3 w-3 shrink-0" /> Trim length
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{s.title}</h4>
                        <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                      </div>
                    </div>
                  </GlowCard>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Skill courses */}
        <section className="border-b bg-sky-50/80 dark:bg-sky-950/20">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" /> Coming soon
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">Skill courses to close your gap</h2>
              <p className="mt-3 text-muted-foreground">
                Short, project-based courses mapped to what our AI matching looks for — join the
                waitlist and we&apos;ll let you know the moment they launch.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SKILL_COURSES.map((c, i) => (
                <Reveal key={c.title} delay={i * 80}>
                  <Card className="group h-full overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={c.image}
                        alt={c.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 320px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Course colour tint + bottom fade for depth */}
                      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-55 mix-blend-multiply', c.gradient)} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {/* Small icon badge */}
                      <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm ring-1 ring-white/30">
                        <c.icon className="h-5 w-5" />
                      </span>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold">{c.title}</h3>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {c.points.map((point) => (
                          <li key={point} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                            {point}
                          </li>
                        ))}
                      </ul>
                      <Button variant="outline" className="mt-5 w-full" asChild>
                        <Link href="/contact">Join the waitlist</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Popular certification courses */}
        <section className="relative overflow-hidden border-b bg-blue-100/50 dark:bg-blue-950/25">
          <SectionBg src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80" />
          <div className="relative mx-auto max-w-7xl px-6 py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Popular certification courses</h2>
                <p className="mt-2 text-muted-foreground">The fastest way to build your CV — launching soon.</p>
              </div>
            </div>
            <Reveal className="mt-10">
              <CertificationCarousel />
            </Reveal>
          </div>
        </section>

        {/* FAQ / queries — two-column: intro + illustration on the left, accordion on the right */}
        <section id="faq" className="border-b bg-background">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Left: heading + help link + question-mark illustration */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h2>
              <p className="mt-3 text-muted-foreground">
                Haven&apos;t found what you&apos;re looking for?{' '}
                <Link href="/contact" className="font-medium text-primary underline underline-offset-2">Help Center</Link>{' '}
                — we&apos;re here to help.
              </p>

              {/* Illustration */}
              <div className="relative mt-10 hidden h-64 lg:block" aria-hidden="true">
                <div className="anim-drift-1 absolute left-1/4 top-6 h-48 w-64 rounded-full bg-gradient-to-br from-primary/25 to-sky-400/10 blur-3xl" />
                {/* Tilted bar with a "balance" dot */}
                <div className="anim-float-c absolute left-8 top-1/2 h-3 w-56 -translate-y-1/2 -rotate-12 rounded-full bg-gradient-to-r from-primary to-indigo-500 shadow-lg">
                  <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background shadow" />
                </div>
                {/* Floating question marks */}
                <span className="anim-bob absolute left-4 top-6 text-6xl font-black text-primary">?</span>
                <span className="anim-float-a absolute right-16 top-0 text-5xl font-black text-foreground">?</span>
                <span className="anim-float-b absolute bottom-2 left-1/3 text-4xl font-black text-muted-foreground/40">?</span>
                <span className="anim-wiggle absolute bottom-6 right-8 text-3xl font-black text-muted-foreground/30">?</span>
              </div>
            </div>

            {/* Right: minimal accordion */}
            <Reveal>
              <FaqAccordion items={FAQS} variant="minimal" />
              <p className="mt-8 text-sm text-muted-foreground">
                Still have a question?{' '}
                <a href="/contact" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-2">
                  Contact us
                </a>
              </p>
            </Reveal>
          </div>
        </section>

        {/* Photo gallery */}
        <section className="border-b bg-sky-50/80 dark:bg-sky-950/20">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">From learning to landing the role</h2>
              <p className="mt-3 text-muted-foreground">
                Thousands of students build skills, join teams and get hired through CareerSync.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {GALLERY.map((g, i) => (
                <Reveal key={g.src} delay={i * 90}>
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl border shadow-sm">
                    <Image
                      src={g.src}
                      alt={g.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <p className="absolute bottom-4 left-4 text-sm font-semibold text-white drop-shadow">{g.caption}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Success stories / placements */}
        <section className="relative overflow-hidden border-b bg-background">
          <div className="relative mx-auto max-w-7xl px-6 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
                <Award className="anim-bob h-4 w-4 text-primary" /> Success stories
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                <span className="text-primary">10,000+</span> placements — read their stories
              </h2>
              <p className="mt-3 text-muted-foreground">Real students who found their footing through CareerSync.</p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 80}>
                  <Card className="flex h-full flex-col">
                    <CardContent className="flex flex-1 flex-col p-6">
                      <MessageSquare className="h-6 w-6 text-primary/40" />
                      <p className="mt-3 flex-1 text-sm text-muted-foreground">“{t.quote}”</p>
                      <div className="mt-5 flex items-center gap-3 border-t pt-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {t.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{t.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{t.placed}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Recognition / partner bodies */}
        <section className="relative overflow-hidden border-b bg-sky-50/80 dark:bg-sky-950/20">
          <SectionBg src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80" />
          <div className="relative mx-auto max-w-6xl px-6 py-16">
            <div className="rounded-2xl border bg-card p-8 shadow-sm">
              <h2 className="text-xl font-bold tracking-tight">Recognised by leading skill &amp; education bodies</h2>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {PARTNERS.map((p) => (
                  <div key={p.name} className="flex flex-col items-center gap-3 rounded-xl border bg-background/60 px-3 py-5 text-center">
                    <span className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-base font-black text-white shadow-sm', p.gradient)}>
                      {p.name.replace(/[^A-Z]/g, '').slice(0, 3) || p.name.slice(0, 2)}
                    </span>
                    <span className="text-sm font-semibold">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden border-t bg-gradient-to-b from-indigo-100 to-indigo-50 dark:from-indigo-950/40 dark:to-slate-950/20">
          <Image
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80"
            alt=""
            fill
            sizes="100vw"
            className="pointer-events-none object-cover opacity-10"
          />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-16 text-center">
            {/* Pulsing ring behind the CTA button area */}
            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="anim-wiggle h-4 w-4" /> Start free today
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Ready to bridge into your next internship?</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Join thousands of students and companies already using CareerSync.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/register">Get started — it&apos;s free</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/** Faint full-bleed background photo for a section. Purely decorative. */
function SectionBg({ src, className }: { src: string; className?: string }) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      fill
      sizes="100vw"
      className={cn('pointer-events-none select-none object-cover opacity-[0.06] dark:opacity-[0.08]', className)}
    />
  );
}

/** Fades + slides its children in when scrolled into view. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700 ease-out motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
}

/** Horizontally scrollable row of certification course cards, with arrow controls. */
function CertificationCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CERT_COURSES.map((c) => (
          <div
            key={c.title}
            className="group w-64 shrink-0 snap-start overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Image header */}
            <div className="relative h-28 overflow-hidden">
              <Image
                src={c.image}
                alt={c.title}
                fill
                sizes="256px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm ring-1 ring-white/25">
                <Clock className="h-3 w-3" /> {c.weeks} weeks
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-semibold leading-snug">{c.title}</h3>
              <span className="mt-3 inline-block text-xs font-medium text-muted-foreground">{c.tag}</span>
              <Link
                href="/contact"
                className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Know more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="absolute -left-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-card shadow-md hover:bg-muted sm:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="absolute -right-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-card shadow-md hover:bg-muted sm:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Counts up from 0 to `value` when scrolled into view. */
function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    let raf = 0;
    let startTs: number | null = null;
    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

// Floating icon-tile badges (white rounded cards with a colored icon), aligned
// in two neat vertical columns on each side. Rendered by <SideDecor />.
type DecorIcon = { icon: typeof Sparkles; color: string; anim: string };
const DECOR_LEFT: DecorIcon[] = [
  { icon: Sparkles, color: 'text-sky-500', anim: 'anim-float-a' },
  { icon: HelpCircle, color: 'text-primary', anim: 'anim-bob' },
  { icon: Target, color: 'text-rose-500', anim: 'anim-float-c' },
  { icon: FileText, color: 'text-emerald-500', anim: 'anim-float-b' },
  { icon: Search, color: 'text-indigo-500', anim: 'anim-wiggle' },
];
const DECOR_RIGHT: DecorIcon[] = [
  { icon: MessageSquare, color: 'text-indigo-500', anim: 'anim-float-b' },
  { icon: CheckCircle2, color: 'text-emerald-500', anim: 'anim-float-a' },
  { icon: Zap, color: 'text-yellow-500', anim: 'anim-wiggle' },
  { icon: Code2, color: 'text-sky-500', anim: 'anim-float-c' },
  { icon: BarChart3, color: 'text-violet-500', anim: 'anim-bob' },
];

function DecorTile({ d }: { d: DecorIcon }) {
  return (
    <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-card/90 shadow-lg backdrop-blur', d.anim)}>
      <d.icon className={cn('h-6 w-6', d.color)} />
    </div>
  );
}

/** Reusable animated decorations — two aligned columns of icon tiles + orbs. */
function SideDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block" aria-hidden="true">
      {/* Soft blur orbs */}
      <div className="anim-drift-1 absolute -left-12 top-8 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
      <div className="anim-drift-2 absolute -right-12 bottom-8 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl" />
      {/* Left column — aligned & evenly spaced */}
      <div className="absolute left-10 top-1/2 flex -translate-y-1/2 flex-col items-center gap-10">
        {DECOR_LEFT.map((d, i) => <DecorTile key={i} d={d} />)}
      </div>
      {/* Right column — aligned & evenly spaced */}
      <div className="absolute right-10 top-1/2 flex -translate-y-1/2 flex-col items-center gap-10">
        {DECOR_RIGHT.map((d, i) => <DecorTile key={i} d={d} />)}
      </div>
    </div>
  );
}

function FaqAccordion({
  items,
  variant = 'card',
}: {
  items: { q: string; a: string }[];
  variant?: 'card' | 'minimal';
}) {
  const [open, setOpen] = useState<number | null>(0);

  // Minimal: borderless rows divided by a bottom line + a chevron-down.
  if (variant === 'minimal') {
    return (
      <div className="divide-y divide-border border-t border-border">
        {items.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className={cn('font-medium', isOpen && 'text-primary')}>{f.q}</span>
                <ChevronRight
                  className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform', isOpen ? 'rotate-90' : '')}
                />
              </button>
              <div className={cn('grid transition-all duration-300 ease-in-out', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                <div className="overflow-hidden">
                  <p className="pb-4 pr-8 text-sm text-muted-foreground">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={f.q}
            className={cn(
              'overflow-hidden rounded-xl border bg-card transition-colors',
              isOpen ? 'border-primary/40 shadow-md' : 'hover:border-primary/30'
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 px-5 py-4 text-left"
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors',
                  isOpen ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                )}
              >
                {i + 1}
              </span>
              <span className={cn('flex-1 font-semibold', isOpen && 'text-primary')}>{f.q}</span>
              <ChevronRight
                className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-90')}
              />
            </button>
            <div
              className={cn(
                'grid transition-all duration-300 ease-in-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 pl-16 text-sm text-muted-foreground">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CompanyLogo({ name, domain }: { name: string; domain: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md">
      {err ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
          {name[0]}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
          alt={`${name} logo`}
          className="h-8 w-8 shrink-0 rounded object-contain"
          loading="lazy"
          onError={() => setErr(true)}
        />
      )}
      <span className="truncate font-medium text-foreground">{name}</span>
    </div>
  );
}

