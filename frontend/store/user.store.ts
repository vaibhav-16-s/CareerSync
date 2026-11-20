import { create } from 'zustand';
import type { Company, Student } from '@/types';

// Holds the role-specific domain profile (student or company) for quick access
// across the app without re-fetching. Kept in sync by the profile query hooks.
interface UserState {
  studentProfile: Student | null;
  companyProfile: Company | null;
  setStudentProfile: (s: Student | null) => void;
  setCompanyProfile: (c: Company | null) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  studentProfile: null,
  companyProfile: null,
  setStudentProfile: (studentProfile) => set({ studentProfile }),
  setCompanyProfile: (companyProfile) => set({ companyProfile }),
  reset: () => set({ studentProfile: null, companyProfile: null }),
}));
