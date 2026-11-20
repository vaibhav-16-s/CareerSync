import { api, http } from '@/lib/axios';
export const resumeService = {
    upload: async (file) => {
        const form = new FormData();
        form.append('resume', file);
        const res = await api.post('/resume', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 60_000,
        });
        return res.data.data;
    },
    // Analyze a resume built in-app (raw text) — bypasses PDF parsing.
    analyzeText: (text, name) => http.post('/resume/text', { text, name }),
    versions: () => http.get('/resume/versions'),
    latest: () => http.get('/resume/latest'),
    dashboard: () => http.get('/resume/dashboard'),
    getById: (id) => http.get(`/resume/${id}`),
    compare: (a, b) => http.get('/resume/compare', { params: { a, b } }),
    rewrite: (id) => http.post(`/resume/${id}/rewrite`),
    remove: (id) => http.delete(`/resume/${id}`),
};
