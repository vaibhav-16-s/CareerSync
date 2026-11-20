import { http } from '@/lib/axios';
export const aiService = {
    matchScore: (internshipId) => http.get(`/ai/match/${internshipId}`),
    skillGap: (params) => http.get('/ai/skill-gap', { params }),
    // Adapter: the API returns { recommendations: [...] } where each item uses
    // `internship.id` / `internship.company` / `matchScore`. Normalize to the
    // frontend's Recommendation shape ({ internship._id, .companyId, score }).
    recommendations: async (limit = 10) => {
        const res = await http.get('/ai/recommendations', {
            params: { limit },
        });
        return (res?.recommendations ?? []).map((r) => ({
            internship: {
                ...r.internship,
                _id: r.internship.id,
                companyId: r.internship.company,
            },
            score: r.matchScore,
            reasons: r.reason ? [r.reason] : undefined,
        }));
    },
    resumeFeedback: (role) => http.get('/ai/resume-feedback', {
        params: role ? { role } : undefined,
    }),
    candidateRecommendations: (internshipId) => http.get(`/ai/candidates/${internshipId}`),
};
