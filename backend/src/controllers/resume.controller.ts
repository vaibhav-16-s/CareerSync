import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import { AppError } from '../utils/AppError';
import * as resumeService from '../services/resume.service';

export const upload = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw AppError.badRequest('No resume file provided');
  const version = await resumeService.uploadAndAnalyze(req.user!.id, {
    buffer: req.file.buffer,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
  sendSuccess(res, 201, version);
});

export const analyzeText = catchAsync(async (req: Request, res: Response) => {
  const text = typeof req.body?.text === 'string' ? req.body.text : '';
  if (!text.trim()) throw AppError.badRequest('No resume text provided');
  const name = typeof req.body?.name === 'string' ? req.body.name : undefined;
  const version = await resumeService.analyzeFromText(req.user!.id, { text, name });
  sendSuccess(res, 201, version);
});

export const versions = catchAsync(async (req: Request, res: Response) => {
  const items = await resumeService.listVersions(req.user!.id);
  sendSuccess(res, 200, items);
});

export const latest = catchAsync(async (req: Request, res: Response) => {
  const doc = await resumeService.getLatest(req.user!.id);
  sendSuccess(res, 200, doc);
});

export const dashboard = catchAsync(async (req: Request, res: Response) => {
  const data = await resumeService.getDashboard(req.user!.id);
  sendSuccess(res, 200, data);
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const doc = await resumeService.getVersion(req.user!.id, req.params.id);
  sendSuccess(res, 200, doc);
});

export const compare = catchAsync(async (req: Request, res: Response) => {
  const { a, b } = req.query;
  if (!a || !b) throw AppError.badRequest('Provide two version ids: ?a=&b=');
  const data = await resumeService.compareVersions(req.user!.id, String(a), String(b));
  sendSuccess(res, 200, data);
});

export const rewrite = catchAsync(async (req: Request, res: Response) => {
  const data = await resumeService.rewriteResume(req.user!.id, req.params.id);
  sendSuccess(res, 200, data);
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  const data = await resumeService.deleteVersion(req.user!.id, req.params.id);
  sendSuccess(res, 200, data);
});
