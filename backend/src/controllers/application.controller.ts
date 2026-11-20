import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import * as applicationService from '../services/application.service';

export const apply = catchAsync(async (req: Request, res: Response) => {
  const application = await applicationService.applyToInternship(
    req.user!.id,
    req.params.id,
    req.body.coverLetter
  );
  sendSuccess(res, 201, application);
});

export const withdraw = catchAsync(async (req: Request, res: Response) => {
  const application = await applicationService.withdrawApplication(req.user!.id, req.params.id);
  sendSuccess(res, 200, application);
});

export const myApplications = catchAsync(async (req: Request, res: Response) => {
  const { items, meta } = await applicationService.getStudentApplications(req.user!.id, req.query);
  sendSuccess(res, 200, items, meta);
});

export const listForInternship = catchAsync(async (req: Request, res: Response) => {
  const { items, meta } = await applicationService.getApplicationsForInternship(
    req.params.id,
    req.user!.id,
    req.user!.role,
    req.query
  );
  sendSuccess(res, 200, items, meta);
});

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const application = await applicationService.updateApplicationStatus(
    req.params.id,
    req.user!.id,
    req.user!.role,
    req.body
  );
  sendSuccess(res, 200, application);
});

export const addNote = catchAsync(async (req: Request, res: Response) => {
  const application = await applicationService.addNote(
    req.params.id,
    req.user!.id,
    req.user!.role,
    req.body.text
  );
  sendSuccess(res, 200, application);
});
