import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/ApiResponse';
import * as certificateService from '../services/certificate.service';

export const issue = catchAsync(async (req: Request, res: Response) => {
  const certificate = await certificateService.issueCertificate(req.user!.id, req.body);
  sendSuccess(res, 201, certificate);
});

export const myCertificates = catchAsync(async (req: Request, res: Response) => {
  const items = await certificateService.listMyCertificates(req.user!.id);
  sendSuccess(res, 200, items);
});

export const verify = catchAsync(async (req: Request, res: Response) => {
  const data = await certificateService.verifyCertificate(req.params.certificateId);
  sendSuccess(res, 200, data);
});

export const revoke = catchAsync(async (req: Request, res: Response) => {
  const certificate = await certificateService.revokeCertificate(
    req.user!.id,
    req.user!.role,
    req.params.id,
    req.body.reason
  );
  sendSuccess(res, 200, certificate);
});
