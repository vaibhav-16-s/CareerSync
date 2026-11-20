import { create } from 'zustand';
const DEFAULT_FILTERS = {
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
export const useInternshipStore = create((set) => ({
    filters: { ...DEFAULT_FILTERS },
    setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value, page: 1 } })),
    setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters, page: 1 } })),
    setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
    resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),
}));
