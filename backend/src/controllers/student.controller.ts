import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';
import * as studentService from '../services/student.service';

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const student = await studentService.getMyProfile(req.user!.id);
  sendSuccess(res, 200, student);
});

export const updateMe = catchAsync(async (req: Request, res: Response) => {
  const student = await studentService.updateMyProfile(req.user!.id, req.body);
  sendSuccess(res, 200, student);
});

export const uploadResume = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw AppError.badRequest('No resume file provided');
  const result = await studentService.uploadResume(req.user!.id, req.file.buffer);
  sendSuccess(res, 200, result);
});

export const uploadAvatar = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw AppError.badRequest('No image file provided');
  const result = await studentService.uploadAvatar(req.user!.id, req.file.buffer, req.file.mimetype);
  sendSuccess(res, 200, result);
});

export const removeAvatar = catchAsync(async (req: Request, res: Response) => {
  const result = await studentService.removeAvatar(req.user!.id);
  sendSuccess(res, 200, result);
});

export const saveInternship = catchAsync(async (req: Request, res: Response) => {
  const saved = await studentService.saveInternship(req.user!.id, req.params.internshipId);
  sendSuccess(res, 201, saved);
});

export const unsaveInternship = catchAsync(async (req: Request, res: Response) => {
  const result = await studentService.unsaveInternship(req.user!.id, req.params.internshipId);
  sendSuccess(res, 200, result);
});

export const listSaved = catchAsync(async (req: Request, res: Response) => {
  const { items, meta } = await studentService.listSaved(req.user!.id, req.query);
  sendSuccess(res, 200, items, meta);
});

export const dashboard = catchAsync(async (req: Request, res: Response) => {
  const data = await studentService.getDashboard(req.user!.id);
  sendSuccess(res, 200, data);
});
