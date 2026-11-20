import { create } from 'zustand';
import type { InternshipFilters } from '@/types';

const DEFAULT_FILTERS: InternshipFilters = {
  q: '',
  skills: '',
  city: '',
  remote: undefined,
  minStipend: undefined,
  year: undefined,
  sort: 'recent',
  page: 1,
  limit: 12,
};

// Persists the active search/filter state for the internship explorer so the
// experience survives navigation between list and detail pages.
interface InternshipState {
  filters: InternshipFilters;
  setFilter: <K extends keyof InternshipFilters>(
    key: K,
    value: InternshipFilters[K]
  ) => void;
  setFilters: (filters: Partial<InternshipFilters>) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useInternshipStore = create<InternshipState>((set) => ({
  filters: { ...DEFAULT_FILTERS },
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value, page: 1 } })),
  setFilters: (filters) =>
    set((s) => ({ filters: { ...s.filters, ...filters, page: 1 } })),
  setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),
}));
