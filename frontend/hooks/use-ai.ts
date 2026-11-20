'use client';

import { useQuery } from '@tanstack/react-query';
import { aiService } from '@/services/ai.service';
import { qk } from '@/lib/query-keys';

export function useMatchScore(internshipId: string, enabled = true) {
  return useQuery({
    queryKey: qk.ai.match(internshipId),
    queryFn: () => aiService.matchScore(internshipId),
    enabled: enabled && Boolean(internshipId),
    staleTime: 5 * 60_000,
  });
}

export function useSkillGap(params: { role?: string; internshipId?: string }, enabled = true) {
  return useQuery({
    queryKey: qk.ai.skillGap(params),
    queryFn: () => aiService.skillGap(params),
    enabled: enabled && Boolean(params.role || params.internshipId),
    staleTime: 5 * 60_000,
  });
}

export function useRecommendations(limit = 10) {
  return useQuery({
    queryKey: qk.ai.recommendations,
    queryFn: () => aiService.recommendations(limit),
    staleTime: 5 * 60_000,
  });
}

export function useResumeFeedback(role?: string, enabled = true) {
  return useQuery({
    queryKey: qk.ai.resumeFeedback(role),
    queryFn: () => aiService.resumeFeedback(role),
    enabled,
    staleTime: 5 * 60_000,
  });
}

export function useCandidateRecommendations(internshipId: string, enabled = true) {
  return useQuery({
    queryKey: qk.ai.candidates(internshipId),
    queryFn: () => aiService.candidateRecommendations(internshipId),
    enabled: enabled && Boolean(internshipId),
  });
}
