import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Course progress is a purely client-side, local-device convenience (no
// backend course/enrollment API exists yet) — persisted so it survives
// refreshes, same pattern as the auth store's persisted `user`.
export const useCourseStore = create()(
  persist(
    (set, get) => ({
      // { [courseId]: { progress: number (0-100), completed: boolean, enrolledAt: string } }
      enrollments: {},

      isEnrolled: (courseId) => Boolean(get().enrollments[courseId]),

      enroll: (courseId) =>
        set((s) => ({
          enrollments: {
            ...s.enrollments,
            [courseId]: s.enrollments[courseId] ?? {
              progress: 0,
              completed: false,
              enrolledAt: new Date().toISOString(),
            },
          },
        })),

      advance: (courseId, step = 20) =>
        set((s) => {
          const current = s.enrollments[courseId];
          if (!current || current.completed) return s;
          const progress = Math.min(100, current.progress + step);
          return {
            enrollments: {
              ...s.enrollments,
              [courseId]: { ...current, progress, completed: progress >= 100 },
            },
          };
        }),
    }),
    {
      name: 'ib-course-enrollments',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
