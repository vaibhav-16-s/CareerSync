'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, Sparkles, X, TrendingUp } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { Pagination } from '@/components/shared/pagination';
import { SearchBar } from '@/components/shared/search-bar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InternshipCard } from '@/features/internships/internship-card';
import { InternshipGridSkeleton } from '@/features/internships/internship-card-skeleton';
import { InternshipFilters } from '@/features/internships/internship-filters';
import { INTERNSHIP_SORT_OPTIONS } from '@/constants';
import { useInternships } from '@/hooks/use-internships';
import {
  useSavedInternships,
  useSaveInternship,
  useUnsaveInternship,
} from '@/hooks/use-student';
import { useInternshipStore } from '@/store/internship.store';

const QUICK_SKILLS = ['React', 'Node', 'Python', 'JavaScript', 'UI/UX'];

export default function StudentSearchPage() {
  const searchParams = useSearchParams();
  const filters = useInternshipStore((s) => s.filters);
  const setFilter = useInternshipStore((s) => s.setFilter);
  const setFilters = useInternshipStore((s) => s.setFilters);
  const setPage = useInternshipStore((s) => s.setPage);
  const resetFilters = useInternshipStore((s) => s.resetFilters);

  // Seed filters from the navbar's internships mega-menu (?city=, ?skills=, ?remote=).
  useEffect(() => {
    const city = searchParams.get('city');
    const skills = searchParams.get('skills');
    const remote = searchParams.get('remote');
    if (city || skills || remote) {
      setFilters({
        ...(city ? { city } : {}),
        ...(skills ? { skills } : {}),
        ...(remote === 'true' ? { remote: true } : {}),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, isLoading, isError, refetch } = useInternships(filters);
  const { data: saved } = useSavedInternships({ limit: 100 });
  const save = useSaveInternship();
  const unsave = useUnsaveInternship();

  const savedIds = useMemo(() => new Set((saved?.items ?? []).map((i) => i._id)), [saved]);
  const items = data?.items ?? [];
  const meta = data?.meta ?? {};

  const toggleSave = (id: string) => {
    if (savedIds.has(id)) unsave.mutate(id);
    else save.mutate(id);
  };

  // Active-filter chips
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (filters.q) chips.push({ key: 'q', label: `“${filters.q}”`, clear: () => setFilter('q', '') });
  if (filters.skills) chips.push({ key: 'skills', label: `Skills: ${filters.skills}`, clear: () => setFilter('skills', '') });
  if (filters.city) chips.push({ key: 'city', label: `City: ${filters.city}`, clear: () => setFilter('city', '') });
  if (filters.minStipend) chips.push({ key: 'stipend', label: `≥ ₹${filters.minStipend}`, clear: () => setFilter('minStipend', undefined) });
  if (filters.year) chips.push({ key: 'year', label: `Year ${filters.year}`, clear: () => setFilter('year', undefined) });
  if (filters.remote) chips.push({ key: 'remote', label: 'Remote only', clear: () => setFilter('remote', undefined) });

  return (
    <div className="space-y-6">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Matched to your skills & goals
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Find your next <span className="text-primary">internship</span>
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Search thousands of roles, filter by what matters, and apply in one click.
          </p>

          <div className="mt-6 max-w-2xl">
            <SearchBar
              value={filters.q}
              onSearch={(v) => setFilter('q', v)}
              placeholder="Search title, role or keyword…"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Popular:</span>
            {QUICK_SKILLS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilter('skills', s.toLowerCase())}
                className="rounded-full border bg-card px-3 py-1 text-xs transition-colors hover:border-primary hover:text-primary"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <InternshipFilters />
        </aside>

        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {isLoading ? 'Searching…' : `${meta.total ?? items.length} internship${(meta.total ?? items.length) === 1 ? '' : 's'} found`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sort by</span>
              <Select value={filters.sort ?? 'recent'} onValueChange={(v) => setFilter('sort', v)}>
                <SelectTrigger className="h-9 w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INTERNSHIP_SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filter chips */}
          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <Badge key={c.key} variant="secondary" className="gap-1 py-1 pl-2.5 pr-1 font-normal">
                  {c.label}
                  <button type="button" onClick={c.clear} className="rounded-full p-0.5 hover:bg-background" aria-label={`Clear ${c.key}`}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <button type="button" onClick={resetFilters} className="text-xs text-muted-foreground underline-offset-2 hover:underline">
                Clear all
              </button>
            </div>
          )}

          {/* Results */}
          {isError ? (
            <ErrorState onRetry={refetch} />
          ) : isLoading ? (
            <InternshipGridSkeleton count={6} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="No internships match your filters"
              description="Try widening your search or clearing some filters."
            />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((internship) => (
                  <InternshipCard
                    key={internship._id}
                    internship={internship}
                    saved={savedIds.has(internship._id)}
                    onToggleSave={toggleSave}
                    saving={save.isPending || unsave.isPending}
                  />
                ))}
              </div>
              <Pagination page={meta.page ?? 1} totalPages={meta.totalPages ?? 1} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
