import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import * as chatService from '../services/chat.service';

export const start = catchAsync(async (req: Request, res: Response) => {
  const conversation = await chatService.startConversation(req.user!.id, req.user!.role, req.body);
  sendSuccess(res, 201, conversation);
});

export const list = catchAsync(async (req: Request, res: Response) => {
  const items = await chatService.listConversations(req.user!.id);
  sendSuccess(res, 200, items);
});

export const messages = catchAsync(async (req: Request, res: Response) => {
  const { items, meta } = await chatService.getMessages(req.user!.id, req.params.id, req.query);
  sendSuccess(res, 200, items, meta);
});

export const send = catchAsync(async (req: Request, res: Response) => {
  const message = await chatService.sendMessage(req.user!.id, req.params.id, req.body);
  sendSuccess(res, 201, message);
});

export const read = catchAsync(async (req: Request, res: Response) => {
  const result = await chatService.markRead(req.user!.id, req.params.id);
  sendSuccess(res, 200, result);
});

export const unreadCount = catchAsync(async (req: Request, res: Response) => {
  const result = await chatService.getUnreadCount(req.user!.id);
  sendSuccess(res, 200, result);
});
