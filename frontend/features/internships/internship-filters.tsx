'use client';

import { SlidersHorizontal, RotateCcw, MapPin, Wallet, GraduationCap, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { YEAR_OPTIONS } from '@/constants';
import { useInternshipStore } from '@/store/internship.store';

export function InternshipFilters() {
  const filters = useInternshipStore((s) => s.filters);
  const setFilter = useInternshipStore((s) => s.setFilter);
  const resetFilters = useInternshipStore((s) => s.resetFilters);

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
        </h3>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetFilters}>
          <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
        </Button>
      </div>

      <div className="space-y-5 p-4">
        <Field icon={SlidersHorizontal} label="Skills">
          <Input
            placeholder="e.g. react, node, python"
            defaultValue={filters.skills}
            onBlur={(e) => setFilter('skills', e.target.value)}
          />
          <p className="mt-1 text-xs text-muted-foreground">Comma-separated. Blur to apply.</p>
        </Field>

        <Field icon={MapPin} label="City">
          <Input
            placeholder="e.g. Bengaluru"
            defaultValue={filters.city}
            onBlur={(e) => setFilter('city', e.target.value)}
          />
        </Field>

        <Field icon={Wallet} label="Minimum stipend">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
            <Input
              type="number"
              min={0}
              placeholder="0"
              className="pl-7"
              defaultValue={filters.minStipend ?? ''}
              onBlur={(e) => setFilter('minStipend', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </Field>

        <Field icon={GraduationCap} label="Eligible year">
          <Select
            value={filters.year ? String(filters.year) : 'any'}
            onValueChange={(v) => setFilter('year', v === 'any' ? undefined : Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any year</SelectItem>
              {YEAR_OPTIONS.map((y) => (
                <SelectItem key={y.value} value={y.value}>
                  {y.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
          <Label htmlFor="remote-only" className="flex cursor-pointer items-center gap-2 text-sm">
            <Wifi className="h-4 w-4 text-muted-foreground" /> Remote only
          </Label>
          <Switch
            id="remote-only"
            checked={Boolean(filters.remote)}
            onCheckedChange={(v) => setFilter('remote', v ? true : undefined)}
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </Label>
      {children}
    </div>
  );
}
