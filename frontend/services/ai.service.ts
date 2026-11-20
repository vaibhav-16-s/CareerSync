import { http } from '@/lib/axios';
import type {
  Internship,
  MatchResult,
  Recommendation,
  ResumeFeedback,
  SkillGapResult,
} from '@/types';

// Shape actually returned by the backend `GET /ai/recommendations`.
interface RecommendationsResponse {
  recommendations: Array<{
    internship: {
      id: string;
      title: string;
      company?: { _id?: string; name?: string; logoUrl?: string } | string;
      location?: unknown;
      stipend?: unknown;
      deadline?: string;
    };
    matchScore: number;
    matchedSkills?: string[];
    missingSkills?: string[];
    reason?: string;
  }>;
  profileCompleteness: number;
  note?: string;
}

export const aiService = {
  matchScore: (internshipId: string) =>
    http.get<MatchResult>(`/ai/match/${internshipId}`),

  skillGap: (params: { role?: string; internshipId?: string }) =>
    http.get<SkillGapResult>('/ai/skill-gap', { params }),

  // Adapter: the API returns { recommendations: [...] } where each item uses
  // `internship.id` / `internship.company` / `matchScore`. Normalize to the
  // frontend's Recommendation shape ({ internship._id, .companyId, score }).
  recommendations: async (limit = 10): Promise<Recommendation[]> => {
    const res = await http.get<RecommendationsResponse>('/ai/recommendations', {
      params: { limit },
    });
    return (res?.recommendations ?? []).map((r) => ({
      internship: {
        ...(r.internship as unknown as Internship),
        _id: r.internship.id,
        companyId: r.internship.company as Internship['companyId'],
      },
      score: r.matchScore,
      reasons: r.reason ? [r.reason] : undefined,
    }));
  },

  resumeFeedback: (role?: string) =>
    http.get<ResumeFeedback>('/ai/resume-feedback', {
      params: role ? { role } : undefined,
    }),

  candidateRecommendations: (internshipId: string) =>
    http.get<unknown>(`/ai/candidates/${internshipId}`),
};
