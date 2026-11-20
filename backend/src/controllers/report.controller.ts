import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import * as reportService from '../services/report.service';

export const create = catchAsync(async (req: Request, res: Response) => {
  const report = await reportService.createReport(req.user!.id, req.body);
  sendSuccess(res, 201, report);
});

export const list = catchAsync(async (req: Request, res: Response) => {
  const { items, meta } = await reportService.listReports(req.query);
  sendSuccess(res, 200, items, meta);
});

export const handle = catchAsync(async (req: Request, res: Response) => {
  const report = await reportService.handleReport(req.user!.id, req.params.id, req.body);
  sendSuccess(res, 200, report);
});
