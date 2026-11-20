import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import * as aiService from '../services/ai.service';

export const matchScore = catchAsync(async (req: Request, res: Response) => {
  const data = await aiService.getMatchScore(req.user!.id, req.params.id);
  sendSuccess(res, 200, data);
});

export const skillGap = catchAsync(async (req: Request, res: Response) => {
  const data = await aiService.getSkillGap(req.user!.id, {
    role: req.query.role as string | undefined,
    internshipId: req.query.internshipId as string | undefined,
  });
  sendSuccess(res, 200, data);
});

export const recommendations = catchAsync(async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const data = await aiService.getRecommendations(req.user!.id, limit);
  sendSuccess(res, 200, data);
});

export const candidateRecommendations = catchAsync(async (req: Request, res: Response) => {
  const data = await aiService.getCandidateRecommendations(req.params.id);
  sendSuccess(res, 200, data);
});

export const resumeFeedback = catchAsync(async (req: Request, res: Response) => {
  const data = await aiService.getResumeFeedback(
    req.user!.id,
    req.query.role as string | undefined
  );
  sendSuccess(res, 200, data);
});
