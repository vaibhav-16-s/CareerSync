import { api, http } from '@/lib/axios';
export const companyService = {
    getMe: () => http.get('/companies'),
    getById: (id) => http.get(`/companies/${id}`),
    updateMe: (payload) => http.put('/companies', payload),
    uploadLogo: async (file) => {
        const form = new FormData();
        form.append('logo', file);
        const res = await api.post('/companies/logo', form, { headers: { 'Content-Type': 'multipart/form-data' } });
        return res.data.data;
    },
    submitVerification: (docs) => http.post('/companies/verification', { docs }),
    analytics: () => http.get('/companies/me/analytics'),
    applicants: (params) => http.get('/companies/me/applicants', { params }),
};
