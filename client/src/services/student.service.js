import { api, http } from '@/lib/axios';
export const studentService = {
    getMe: () => http.get('/students/me'),
    updateMe: (payload) => http.put('/students/me', payload),
    dashboard: () => http.get('/students/me/dashboard'),
    uploadResume: async (file) => {
        const form = new FormData();
        form.append('resume', file);
        const res = await api.post('/students/me/resume', form, { headers: { 'Content-Type': 'multipart/form-data' } });
        return res.data.data;
    },
    uploadAvatar: async (file) => {
        const form = new FormData();
        form.append('avatar', file);
        const res = await api.post('/students/me/avatar', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.data;
    },
    removeAvatar: () => http.delete('/students/me/avatar'),
    listSaved: async (params) => {
        const { data, meta } = await http.getWithMeta('/students/me/saved', {
            params,
        });
        return { items: data, meta: meta ?? {} };
    },
    saveInternship: (internshipId) => http.post(`/students/me/saved/${internshipId}`),
    unsaveInternship: (internshipId) => http.delete(`/students/me/saved/${internshipId}`),
    myApplications: async (params) => {
        const { data, meta } = await http.getWithMeta('/applications/me', {
            params,
        });
        return { items: data, meta: meta ?? {} };
    },
};
