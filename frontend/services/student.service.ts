import { api, http } from '@/lib/axios';
import type {
  ApiSuccess,
  Application,
  Internship,
  Paginated,
  Student,
  StudentDashboard,
} from '@/types';

export interface StudentProfileUpdate {
  name?: string;
  headline?: string;
  phone?: string;
  gender?: Student['gender'];
  dateOfBirth?: string;
  location?: { city?: string; country?: string; remoteOk?: boolean };
  yearOfStudy?: number;
  college?: string;
  bio?: string;
  links?: { github?: string; portfolio?: string; linkedin?: string };
  skills?: Student['skills'];
  education?: Student['education'];
  projects?: Student['projects'];
  certifications?: Student['certifications'];
  jobSeekingStatus?: Student['jobSeekingStatus'];
  consent?: Student['consent'];
  whatsappNumber?: string;
  notificationPreferences?: Student['notificationPreferences'];
}

export const studentService = {
  getMe: () => http.get<Student>('/students/me'),

  updateMe: (payload: StudentProfileUpdate) =>
    http.put<Student>('/students/me', payload),

  dashboard: () => http.get<StudentDashboard>('/students/me/dashboard'),

  uploadResume: async (file: File): Promise<Student['resume']> => {
    const form = new FormData();
    form.append('resume', file);
    const res = await api.post<ApiSuccess<Student['resume']>>(
      '/students/me/resume',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data.data;
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl?: string }> => {
    const form = new FormData();
    form.append('avatar', file);
    const res = await api.post<ApiSuccess<{ avatarUrl?: string }>>('/students/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  removeAvatar: () => http.delete<{ avatarUrl: null }>('/students/me/avatar'),

  listSaved: async (params?: Record<string, unknown>): Promise<Paginated<Internship>> => {
    const { data, meta } = await http.getWithMeta<Internship[]>('/students/me/saved', {
      params,
    });
    return { items: data, meta: meta ?? {} };
  },

  saveInternship: (internshipId: string) =>
    http.post(`/students/me/saved/${internshipId}`),

  unsaveInternship: (internshipId: string) =>
    http.delete(`/students/me/saved/${internshipId}`),

  myApplications: async (
    params?: Record<string, unknown>
  ): Promise<Paginated<Application>> => {
    const { data, meta } = await http.getWithMeta<Application[]>('/applications/me', {
      params,
    });
    return { items: data, meta: meta ?? {} };
  },
};
