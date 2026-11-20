import { create } from 'zustand';
export const useUserStore = create((set) => ({
    studentProfile: null,
    companyProfile: null,
    setStudentProfile: (studentProfile) => set({ studentProfile }),
    setCompanyProfile: (companyProfile) => set({ companyProfile }),
    reset: () => set({ studentProfile: null, companyProfile: null }),
}));
