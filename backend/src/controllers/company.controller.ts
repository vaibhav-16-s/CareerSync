import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';
import * as companyService from '../services/company.service';

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const company = await companyService.getMyCompany(req.user!.id);
  sendSuccess(res, 200, company);
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const company = await companyService.getCompanyById(req.params.id);
  sendSuccess(res, 200, company);
});

export const updateMe = catchAsync(async (req: Request, res: Response) => {
  const company = await companyService.updateMyCompany(req.user!.id, req.body);
  sendSuccess(res, 200, company);
});

export const uploadLogo = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw AppError.badRequest('No logo file provided');
  const result = await companyService.uploadLogo(req.user!.id, req.file.buffer);
  sendSuccess(res, 200, result);
});

export const submitVerification = catchAsync(async (req: Request, res: Response) => {
  const company = await companyService.submitVerification(req.user!.id, req.body.docs);
  sendSuccess(res, 200, company);
});

export const analytics = catchAsync(async (req: Request, res: Response) => {
  const data = await companyService.getCompanyAnalytics(req.user!.id);
  sendSuccess(res, 200, data);
});

export const applicants = catchAsync(async (req: Request, res: Response) => {
  const data = await companyService.getAllApplicants(req.user!.id, req.query);
  sendSuccess(res, 200, data);
});
