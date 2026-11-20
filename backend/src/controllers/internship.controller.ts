import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import * as internshipService from '../services/internship.service';

export const create = catchAsync(async (req: Request, res: Response) => {
  const internship = await internshipService.createInternship(req.user!.id, req.body);
  sendSuccess(res, 201, internship);
});

export const list = catchAsync(async (req: Request, res: Response) => {
  const { items, meta } = await internshipService.listInternships(req.query);
  sendSuccess(res, 200, items, meta);
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const internship = await internshipService.getInternshipById(req.params.id);
  sendSuccess(res, 200, internship);
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const internship = await internshipService.updateInternship(
    req.params.id,
    req.user!.id,
    req.user!.role,
    req.body
  );
  sendSuccess(res, 200, internship);
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  const result = await internshipService.deleteInternship(
    req.params.id,
    req.user!.id,
    req.user!.role
  );
  sendSuccess(res, 200, result);
});
