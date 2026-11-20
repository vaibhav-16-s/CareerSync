'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInternshipStore } from '@/store/internship.store';

type TabKey = 'locations' | 'categories' | 'explore';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'locations', label: 'Top Locations' },
  { key: 'categories', label: 'Top Categories' },
  { key: 'explore', label: 'Explore More' },
];

const LOCATIONS = [
  'Work from home',
  'Bangalore',
  'Delhi NCR',
  'Hyderabad',
  'Gurgaon',
  'Kolkata',
  'Mumbai',
  'Pune',
  'Chennai',
  'Noida',
  'Jaipur',
  'Ahmedabad',
];

const CATEGORIES = [
  'React',
  'Node.js',
  'Python',
  'JavaScript',
  'UI/UX Design',
  'Data Science',
  'Digital Marketing',
  'Content Writing',
  'Human Resources',
  'Sales',
];

const EXPLORE = [
  { label: 'All internships', href: '/student/search' },
  { label: 'Saved internships', href: '/student/saved' },
  { label: 'Post an internship for your company', href: '/register?role=company' },
];

export function InternshipsMenu({ label = 'Internships' }: { label?: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>('locations');
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const setFilters = useInternshipStore((s) => s.setFilters);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const openNow = () => {
    cancelClose();
    setOpen(true);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => () => cancelClose(), []);

  const goToLocation = (city: string) => {
    if (city === 'Work from home') setFilters({ city: '', remote: true });
    else setFilters({ city, remote: undefined });
    setOpen(false);
  };

  const goToCategory = (skill: string) => {
    setFilters({ skills: skill.toLowerCase() });
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1 rounded-md px-2 py-1.5 hover:text-foreground',
          open && 'bg-primary/10 text-primary'
        )}
      >
        {label}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-40 mt-2 flex w-[520px] -translate-x-1/2 overflow-hidden rounded-xl border bg-popover shadow-xl">
          {/* Left: tabs */}
          <div className="w-[190px] shrink-0 space-y-1 border-r bg-muted/30 p-3">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  'block w-full rounded-full px-4 py-2 text-left text-sm font-medium text-foreground/80 hover:bg-primary/5',
                  tab === t.key && 'bg-primary/10 text-primary'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Right: contextual list */}
          <div className="max-h-80 flex-1 overflow-y-auto p-3">
            {tab === 'locations' && (
              <ul className="space-y-1">
                {LOCATIONS.map((city) => (
                  <li key={city}>
                    <Link
                      href={city === 'Work from home' ? '/student/search?remote=true' : `/student/search?city=${encodeURIComponent(city)}`}
                      onClick={() => goToLocation(city)}
                      className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-primary/5 hover:text-foreground"
                    >
                      {city === 'Work from home' ? city : `Internships in ${city}`}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {tab === 'categories' && (
              <ul className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <Link
                      href={`/student/search?skills=${encodeURIComponent(cat.toLowerCase())}`}
                      onClick={() => goToCategory(cat)}
                      className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-primary/5 hover:text-foreground"
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {tab === 'explore' && (
              <ul className="space-y-1">
                {EXPLORE.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-primary/5 hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
