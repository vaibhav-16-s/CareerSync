'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { studentService, type StudentProfileUpdate } from '@/services/student.service';
import { qk } from '@/lib/query-keys';
import { useUserStore } from '@/store/user.store';

export function useStudentProfile(enabled = true) {
  const setStudentProfile = useUserStore((s) => s.setStudentProfile);
  return useQuery({
    queryKey: qk.student.me,
    queryFn: async () => {
      const data = await studentService.getMe();
      setStudentProfile(data);
      return data;
    },
    enabled,
  });
}

export function useStudentDashboard() {
  return useQuery({
    queryKey: qk.student.dashboard,
    queryFn: () => studentService.dashboard(),
  });
}

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();
  const setStudentProfile = useUserStore((s) => s.setStudentProfile);
  return useMutation({
    mutationFn: (payload: StudentProfileUpdate) => studentService.updateMe(payload),
    onSuccess: (data) => {
      setStudentProfile(data);
      queryClient.setQueryData(qk.student.me, data);
      queryClient.invalidateQueries({ queryKey: qk.student.dashboard });
      toast.success('Profile updated');
    },
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => studentService.uploadResume(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.student.me });
      queryClient.invalidateQueries({ queryKey: qk.student.dashboard });
      toast.success('Resume uploaded');
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => studentService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.student.me });
      toast.success('Profile photo updated');
    },
    onError: () => toast.error('Could not upload photo'),
  });
}

export function useRemoveAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => studentService.removeAvatar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.student.me });
      toast.success('Photo removed');
    },
  });
}

export function useSavedInternships(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: qk.student.saved(params),
    queryFn: () => studentService.listSaved(params),
  });
}

export function useSaveInternship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (internshipId: string) => studentService.saveInternship(internshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'saved'] });
      queryClient.invalidateQueries({ queryKey: qk.student.dashboard });
      toast.success('Saved to your list');
    },
  });
}

export function useUnsaveInternship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (internshipId: string) => studentService.unsaveInternship(internshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'saved'] });
      queryClient.invalidateQueries({ queryKey: qk.student.dashboard });
      toast.success('Removed from saved');
    },
  });
}
