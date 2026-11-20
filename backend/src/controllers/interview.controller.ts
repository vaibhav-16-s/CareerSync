import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import * as interviewService from '../services/interview.service';

export const create = catchAsync(async (req: Request, res: Response) => {
  const interview = await interviewService.scheduleInterview(req.user!.id, req.body);
  sendSuccess(res, 201, interview);
});

export const list = catchAsync(async (req: Request, res: Response) => {
  const items = await interviewService.listInterviews(req.user!.id, req.user!.role, req.query);
  sendSuccess(res, 200, items);
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const interview = await interviewService.getInterview(req.user!.id, req.user!.role, req.params.id);
  sendSuccess(res, 200, interview);
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const interview = await interviewService.updateInterview(
    req.user!.id,
    req.user!.role,
    req.params.id,
    req.body
  );
  sendSuccess(res, 200, interview);
});

export const calendar = catchAsync(async (req: Request, res: Response) => {
  const ics = await interviewService.getInterviewIcs(
    req.user!.id,
    req.user!.role,
    req.params.id,
    new Date()
  );
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="interview-${req.params.id}.ics"`);
  res.status(200).send(ics);
});
