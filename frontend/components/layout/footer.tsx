import Link from 'next/link';
import { Twitter, Linkedin, Github, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { APP_NAME } from '@/constants';

const COLUMNS = [
  {
    heading: 'Company',
    links: [
      { label: 'About us', href: '/about' },
      { label: "We're hiring", href: '/#careers' },
      { label: 'Hire interns for your company', href: '/register?role=company' },
      { label: 'Post a job', href: '/company/internships/new' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Blog', href: '/#blog' },
      { label: 'Our services', href: '/#features' },
      { label: 'Free job alerts', href: '/register?role=student' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms & conditions', href: '/#terms' },
      { label: 'Privacy policy', href: '/#privacy' },
      { label: 'Contact us', href: '/contact' },
      { label: 'Grievance redressal', href: '/contact' },
    ],
  },
  {
    heading: 'Explore',
    links: [
      { label: 'Sitemap', href: '/#top' },
      { label: 'List of companies', href: '/student/search' },
      { label: 'Jobs for women', href: '/student/search' },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h4 className="text-sm font-semibold text-white">{column.heading}</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact details */}
        <div className="mt-10 border-t border-white/10 pt-8">
          <h4 className="text-sm font-semibold text-white">Get in touch</h4>
          <div className="mt-4 grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
              3rd Floor, Tech Park, MG Road, Bengaluru, Karnataka 560001, India
            </p>
            <a href="tel:+919058767010" className="flex items-start gap-2 transition-colors hover:text-white">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
              +91 90587 67010
            </a>
            <a
              href="mailto:interbridge001@gmail.com"
              className="flex items-start gap-2 break-all transition-colors hover:text-white"
            >
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
              interbridge001@gmail.com
            </a>
          </div>
        </div>

        {/* Join channel bar */}
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-white/10 pt-8 sm:items-start">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Join our channel to get exciting opportunities
          </p>
          <div className="flex gap-3">
            <a
              href="https://wa.me/919058767010"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Internships
            </a>
            <a
              href="https://wa.me/919058767010"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Fresher jobs
            </a>
          </div>
        </div>

        {/* Social row */}
        <div className="mt-6 flex items-center justify-center gap-4 border-t border-white/10 pt-6 sm:justify-start">
          <a href="#" aria-label="Instagram" className="text-slate-400 transition-colors hover:text-white"><Instagram className="h-5 w-5" /></a>
          <a href="#" aria-label="Twitter" className="text-slate-400 transition-colors hover:text-white"><Twitter className="h-5 w-5" /></a>
          <a href="#" aria-label="YouTube" className="text-slate-400 transition-colors hover:text-white"><Youtube className="h-5 w-5" /></a>
          <a href="#" aria-label="LinkedIn" className="text-slate-400 transition-colors hover:text-white"><Linkedin className="h-5 w-5" /></a>
          <a href="https://github.com/ayankgg/Interbridge" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-slate-400 transition-colors hover:text-white"><Github className="h-5 w-5" /></a>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row">
          <p>© {year} {APP_NAME}. All rights reserved.</p>
          <p>Made with care for students &amp; companies.</p>
        </div>
      </div>
    </footer>
  );
}
