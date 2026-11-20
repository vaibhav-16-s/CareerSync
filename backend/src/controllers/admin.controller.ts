import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import * as adminService from '../services/admin.service';

export const listUsers = catchAsync(async (req: Request, res: Response) => {
  const { items, meta } = await adminService.listUsers(req.query);
  sendSuccess(res, 200, items, meta);
});

export const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const user = await adminService.updateUserStatus(
    req.user!.id,
    req.params.id,
    req.body.status,
    req.body.reason
  );
  sendSuccess(res, 200, user);
});

export const pendingCompanies = catchAsync(async (req: Request, res: Response) => {
  const { items, meta } = await adminService.listPendingCompanies(req.query);
  sendSuccess(res, 200, items, meta);
});

export const verifyCompany = catchAsync(async (req: Request, res: Response) => {
  const company = await adminService.verifyCompany(
    req.user!.id,
    req.params.id,
    req.body.decision,
    req.body.reason
  );
  sendSuccess(res, 200, company);
});

export const moderateInternship = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.moderateInternship(req.user!.id, req.params.id);
  sendSuccess(res, 200, result);
});

export const analytics = catchAsync(async (_req: Request, res: Response) => {
  const data = await adminService.getPlatformAnalytics();
  sendSuccess(res, 200, data);
});
