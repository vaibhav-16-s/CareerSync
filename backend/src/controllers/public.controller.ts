import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import * as publicService from '../services/public.service';
import * as referralService from '../services/referral.service';

export const student = catchAsync(async (req: Request, res: Response) => {
  const data = await publicService.getPublicStudent(req.params.slug);
  sendSuccess(res, 200, data);
});

export const company = catchAsync(async (req: Request, res: Response) => {
  const data = await publicService.getPublicCompany(req.params.slug);
  sendSuccess(res, 200, data);
});

export const setStudentVisibility = catchAsync(async (req: Request, res: Response) => {
  const data = await publicService.setStudentVisibility(req.user!.id, Boolean(req.body.publicProfile));
  sendSuccess(res, 200, data);
});

export const setCompanyVisibility = catchAsync(async (req: Request, res: Response) => {
  const data = await publicService.setCompanyVisibility(req.user!.id, Boolean(req.body.publicProfile));
  sendSuccess(res, 200, data);
});

export const myReferral = catchAsync(async (req: Request, res: Response) => {
  const data = await referralService.getMyReferral(req.user!.id);
  sendSuccess(res, 200, data);
});
