import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import * as notificationService from '../services/notification.service';

export const list = catchAsync(async (req: Request, res: Response) => {
  const { items, meta } = await notificationService.listNotifications(req.user!.id, req.query);
  sendSuccess(res, 200, items, meta);
});

export const markRead = catchAsync(async (req: Request, res: Response) => {
  const notification = await notificationService.markRead(req.user!.id, req.params.id);
  sendSuccess(res, 200, notification);
});

export const markAllRead = catchAsync(async (req: Request, res: Response) => {
  const result = await notificationService.markAllRead(req.user!.id);
  sendSuccess(res, 200, result);
});
