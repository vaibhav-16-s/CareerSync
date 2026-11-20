'use client';

import Link from 'next/link';
import { MapPin, Wallet, Clock, Bookmark, BookmarkCheck, Building2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { asObject, cn, deadlineState, fromNow, stipendLabel } from '@/lib/utils';
import type { Internship } from '@/types';

interface InternshipCardProps {
  internship: Internship;
  href?: string;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
  saving?: boolean;
}

export function InternshipCard({ internship, href, saved, onToggleSave, saving }: InternshipCardProps) {
  const company = asObject(internship.companyId);
  const deadline = deadlineState(internship.deadline);
  const link = href ?? `/student/internships/${internship._id}`;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      {/* top accent revealed on hover */}
      <div className="h-1 bg-gradient-to-r from-primary to-indigo-400 opacity-0 transition-opacity group-hover:opacity-100" />

      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/15 to-indigo-400/10 ring-1 ring-border">
              {company?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <Link href={link} className="line-clamp-1 font-semibold leading-tight hover:text-primary">
                {internship.title}
              </Link>
              <p className="line-clamp-1 text-sm text-muted-foreground">{company?.name ?? 'Company'}</p>
            </div>
          </div>
          {onToggleSave && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              disabled={saving}
              onClick={() => onToggleSave(internship._id)}
              aria-label={saved ? 'Unsave' : 'Save'}
            >
              {saved ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {internship.requiredSkills.slice(0, 4).map((s) => (
            <Badge key={s.skillId} variant="secondary" className="font-normal">
              {s.name}
            </Badge>
          ))}
          {internship.requiredSkills.length > 4 && (
            <Badge variant="outline" className="font-normal">
              +{internship.requiredSkills.length - 4}
            </Badge>
          )}
        </div>

        <div className="mt-auto space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2 text-muted-foreground">
            <span className="flex min-w-0 items-center gap-1.5" title={internship.location.remoteOk ? 'Remote' : internship.location.city || 'On-site'}>
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {internship.location.remoteOk ? 'Remote' : internship.location.city || 'On-site'}
              </span>
            </span>
            <span className="flex min-w-0 items-center gap-1.5 font-medium text-foreground" title={stipendLabel(internship.stipend)}>
              <Wallet className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{stipendLabel(internship.stipend)}</span>
            </span>
            <span className="flex min-w-0 items-center gap-1.5" title={internship.duration || 'Flexible'}>
              <Clock className="h-4 w-4 shrink-0" />
              <span className="truncate">{internship.duration || 'Flexible'}</span>
            </span>
            <span
              className={cn(
                'inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium',
                deadline.urgent
                  ? 'bg-red-500/10 text-red-600'
                  : 'bg-emerald-500/10 text-emerald-600'
              )}
            >
              {deadline.label}
            </span>
          </div>
        </div>
      </CardContent>

      <div className="flex items-center justify-between border-t px-5 py-3 text-xs text-muted-foreground">
        <span>Posted {fromNow(internship.createdAt)}</span>
        <Link
          href={link}
          className="inline-flex items-center gap-1 font-medium text-primary transition-transform group-hover:translate-x-0.5 hover:underline"
        >
          View details <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  );
}
