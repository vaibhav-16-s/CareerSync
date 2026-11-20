import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const allowedResume = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const allowedImage = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const storage = multer.memoryStorage();

export const uploadResume = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (allowedResume.includes(file.mimetype)) cb(null, true);
    else cb(AppError.badRequest('Only PDF or DOCX files are allowed'));
  },
}).single('resume');

export const uploadLogo = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedImage.includes(file.mimetype)) cb(null, true);
    else cb(AppError.badRequest('Only PNG, JPG or WEBP images are allowed'));
  },
}).single('logo');

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedImage.includes(file.mimetype)) cb(null, true);
    else cb(AppError.badRequest('Only PNG, JPG or WEBP images are allowed'));
  },
}).single('avatar');

// ---- Magic-byte (content) validation ----
// The multer fileFilter only sees the client-supplied Content-Type, which is
// trivially spoofable. After upload we inspect the actual file signature to
// reject content that doesn't match an allowed real type.

function startsWith(buf: Buffer, bytes: number[], offset = 0): boolean {
  if (buf.length < offset + bytes.length) return false;
  return bytes.every((b, i) => buf[offset + i] === b);
}

function isPdf(buf: Buffer): boolean {
  return startsWith(buf, [0x25, 0x50, 0x44, 0x46]); // %PDF
}
function isZipDocx(buf: Buffer): boolean {
  // DOCX is a ZIP container: PK\x03\x04
  return startsWith(buf, [0x50, 0x4b, 0x03, 0x04]);
}
function isPng(buf: Buffer): boolean {
  return startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
}
function isJpeg(buf: Buffer): boolean {
  return startsWith(buf, [0xff, 0xd8, 0xff]);
}
function isWebp(buf: Buffer): boolean {
  return startsWith(buf, [0x52, 0x49, 0x46, 0x46]) && startsWith(buf, [0x57, 0x45, 0x42, 0x50], 8);
}

type Kind = 'resume' | 'image';

export const verifyFileSignature =
  (kind: Kind, required = true) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const file = req.file;
    if (!file) {
      next(required ? AppError.badRequest('No file provided') : undefined);
      return;
    }
    const buf = file.buffer;
    const ok =
      kind === 'resume'
        ? isPdf(buf) || isZipDocx(buf)
        : isPng(buf) || isJpeg(buf) || isWebp(buf);

    if (!ok) {
      next(AppError.badRequest('File content does not match an allowed file type'));
      return;
    }
    next();
  };
