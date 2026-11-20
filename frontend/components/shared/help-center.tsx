'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  FileText,
  CheckSquare,
  Clock,
  XCircle,
  MessageSquare,
  Phone,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HelpItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  steps?: string[];
  body?: string;
}

const STUDENT_ITEMS: HelpItem[] = [
  {
    icon: FileText,
    title: 'How to upload your resume',
    subtitle: 'Step-by-step guide',
    steps: [
      "Open the 'Resume' tab from the sidebar.",
      "Click 'Upload resume' and choose your file — or 'Open' to preview it first.",
      'Make sure it is a clear PDF or DOCX, under 10 MB.',
      'Wait for the green checkmark confirming a successful upload.',
      'Your resume is now attached to every application automatically.',
    ],
  },
  {
    icon: CheckSquare,
    title: 'Accepted file formats',
    subtitle: 'PDF, DOCX — max 10 MB per file',
    body: 'Resumes and documents can be PDF or DOCX, up to 10 MB each. Use a clear, well-formatted file so companies can read it easily.',
  },
  {
    icon: Clock,
    title: 'How matching works',
    subtitle: 'Explainable AI match scores',
    body: 'Each internship shows a match score based on your skills, proficiency and projects versus what the role needs. Add skills and complete your profile to raise your score.',
  },
  {
    icon: XCircle,
    title: 'Why was my application rejected?',
    subtitle: 'Common reasons',
    body: 'Companies may reject due to a skill mismatch, an incomplete profile, or positions already being filled. Keep your profile and skills up to date to improve your chances.',
  },
];

const COMPANY_ITEMS: HelpItem[] = [
  {
    icon: FileText,
    title: 'How to post an internship',
    subtitle: 'Step-by-step guide',
    steps: [
      "Open 'Post Internship' from the sidebar.",
      'Fill in the role, description, required skills and eligibility.',
      'Set the stipend, duration, openings and application deadline.',
      "Choose 'Active' to publish, or 'Draft' to save for later.",
      "Click 'Post' — it goes live once your company is verified.",
    ],
  },
  {
    icon: CheckSquare,
    title: 'How to get verified',
    subtitle: 'Required before publishing',
    steps: [
      'Go to Company Profile → Verification.',
      'Complete your company details and add a logo.',
      'Submit a registration document link.',
      'Wait for admin review (usually 1–3 working days).',
      'Once verified, your internships publish instantly.',
    ],
  },
  {
    icon: Clock,
    title: 'Verification timeline',
    subtitle: 'Usually verified within 1–3 working days',
    body: "Our team reviews submitted documents within 1–3 working days. You'll be notified once your company is verified, or if more information is needed.",
  },
  {
    icon: XCircle,
    title: 'Why was my company rejected?',
    subtitle: 'Common reasons',
    body: 'Rejections usually happen due to unreadable documents, mismatched company details, or missing registration proof. Update your details and resubmit.',
  },
];

/** Reusable Help Center with expandable FAQ + contact footer. */
export function HelpCenter({ role = 'student' }: { role?: 'student' | 'company' }) {
  const items = role === 'company' ? COMPANY_ITEMS : STUDENT_ITEMS;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Card className="overflow-hidden">
      {/* Green header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-4 text-white">
        <p className="flex items-center gap-2 font-semibold">
          <HelpCircle className="h-5 w-5" /> Help Center
        </p>
        <p className="mt-0.5 text-sm text-emerald-50/90">Quick answers to common questions</p>
      </div>

      <div className="space-y-3 p-4">
        {items.map((it, i) => {
          const isOpen = open === i;
          const Icon = it.icon;
          return (
            <div key={it.title} className={cn('overflow-hidden rounded-xl border', isOpen && 'border-primary/40')}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center gap-3 p-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn('font-semibold', isOpen && 'text-primary')}>{it.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{it.subtitle}</p>
                </div>
                <ChevronDown className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
              </button>

              {isOpen && (
                <div className="border-t px-4 py-3">
                  {it.steps ? (
                    <ol className="space-y-3">
                      {it.steps.map((step, si) => (
                        <li key={si} className="flex gap-3 text-sm">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                            {si + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-muted-foreground">{it.body}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Need help footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquare className="h-4 w-4" />
            </span>
            <div>
              <p className="font-semibold">Need help?</p>
              <p className="text-sm text-muted-foreground">Reach our support team directly</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href="/contact" target="_blank" rel="noopener noreferrer">
              <Phone className="mr-1.5 h-4 w-4" /> Contact
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
