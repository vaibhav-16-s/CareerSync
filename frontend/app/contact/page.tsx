'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PublicHeader } from '@/components/layout/public-header';
import { Footer } from '@/components/layout/footer';

const INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'interbridge001@gmail.com',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=interbridge001@gmail.com',
    newTab: true,
  },
  { icon: Phone, label: 'Helpline', value: '+91 90587 67010', href: 'tel:+919058767010' },
  { icon: MapPin, label: 'Office', value: 'Bengaluru, Karnataka, India' },
  { icon: Clock, label: 'Working hours', value: 'Mon–Sat, 9 AM – 6 PM' },
];

const inputCls =
  'flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', who: '', message: '' });
  const [sending, setSending] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Please enter your name and phone number');
      return;
    }
    setSending(true);
    // No backend contact endpoint yet — simulate a submit and thank the user.
    setTimeout(() => {
      setSending(false);
      toast.success("Thanks! We've received your message and will get back to you soon.");
      setForm({ name: '', phone: '', email: '', who: '', message: '' });
    }, 700);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader active="Contact" />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 text-white">
          <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-6 pb-40 pt-20 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-300">
              <Mail className="h-3.5 w-3.5" /> Contact
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
              Connect{' '}
              <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                With Us
              </span>
            </h1>
            <p className="mt-5 text-lg text-slate-400">
              Whether you&apos;re a student, a company, or just curious — we&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Info cards (overlapping the hero) */}
        <section className="relative z-10 mx-auto -mt-28 max-w-7xl px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {INFO.map((i) => {
              const Wrapper = i.href ? 'a' : 'div';
              return (
                <Wrapper
                  key={i.label}
                  {...(i.href ? { href: i.href } : {})}
                  {...(i.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="rounded-2xl border bg-card p-6 text-center shadow-lg transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <i.icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{i.label}</p>
                  <p className="mt-1 font-medium">{i.value}</p>
                </Wrapper>
              );
            })}
          </div>
        </section>

        {/* Message form */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid overflow-hidden rounded-3xl border shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
            {/* Left panel */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-white sm:p-10">
              <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
              <span className="relative inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300">
                <MessageSquare className="h-3.5 w-3.5" /> Message
              </span>
              <h2 className="relative mt-5 text-4xl font-bold leading-tight">
                Let&apos;s{' '}
                <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                  Connect
                </span>
              </h2>
              <p className="relative mt-4 text-slate-400">
                Fill in the form and our team will reach out within one business day.
              </p>
              <ul className="relative mt-8 space-y-4 text-sm">
                {INFO.slice(0, 3).map((i) => (
                  <li key={i.label} className="flex items-center gap-3 text-slate-300">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                      <i.icon className="h-4 w-4 text-emerald-300" />
                    </span>
                    {i.value}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right form */}
            <form onSubmit={onSubmit} className="space-y-5 bg-card p-8 sm:p-10">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-muted-foreground">Name *</span>
                  <Input value={form.name} onChange={set('name')} placeholder="Your name" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-muted-foreground">Phone number *</span>
                  <Input type="tel" value={form.phone} onChange={set('phone')} placeholder="Mobile number" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-muted-foreground">Email (optional)</span>
                  <Input type="email" value={form.email} onChange={set('email')} placeholder="Email address" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-muted-foreground">Who are you?</span>
                  <select aria-label="Who are you" value={form.who} onChange={set('who')} className={inputCls}>
                    <option value="">Select…</option>
                    <option value="student">Student</option>
                    <option value="company">Company</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium text-muted-foreground">Message</span>
                <textarea
                  value={form.message}
                  onChange={set('message')}
                  rows={5}
                  placeholder="How can we help?"
                  className="flex w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                />
              </label>
              <Button type="submit" size="lg" className="w-full" disabled={sending}>
                {sending ? 'Sending…' : (<>Send message <Send className="ml-1.5 h-4 w-4" /></>)}
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
