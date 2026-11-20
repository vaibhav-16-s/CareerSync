import { z } from 'zod';
import { Proficiency, UserRole } from '@/types';

// Mirrors the backend password policy.
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[0-9]/, 'Must contain a digit');

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is required').max(160),
    email: z.string().email('Enter a valid email'),
    role: z.enum([UserRole.STUDENT, UserRole.COMPANY]),
    password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type RegisterValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10, 'Reset token is required'),
    password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

// ---------- Student profile ----------
export const studentProfileSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  headline: z.string().max(160).optional().or(z.literal('')),
  bio: z.string().max(2000).optional().or(z.literal('')),
  college: z.string().max(160).optional().or(z.literal('')),
  yearOfStudy: z.coerce.number().min(1).max(6).optional(),
  city: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  remoteOk: z.boolean().optional(),
  github: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});
export type StudentProfileValues = z.infer<typeof studentProfileSchema>;

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(60),
  proficiency: z.nativeEnum(Proficiency),
  selfRating: z.coerce.number().min(1).max(5).optional(),
});
export type SkillValues = z.infer<typeof skillSchema>;

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(160),
  description: z.string().max(2000).optional().or(z.literal('')),
  techStack: z.string().optional().or(z.literal('')), // comma-separated in the form
  link: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});
export type ProjectValues = z.infer<typeof projectSchema>;

export const certificationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(160),
  issuer: z.string().max(160).optional().or(z.literal('')),
  url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  date: z.string().optional().or(z.literal('')),
});
export type CertificationValues = z.infer<typeof certificationSchema>;

// ---------- Company profile ----------
export const companyProfileSchema = z.object({
  name: z.string().min(2, 'Company name is required').max(160),
  description: z.string().max(4000).optional().or(z.literal('')),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  industry: z.string().optional().or(z.literal('')),
  size: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
});
export type CompanyProfileValues = z.infer<typeof companyProfileSchema>;

// ---------- Internship ----------
export const internshipSchema = z.object({
  title: z.string().min(3, 'Title is required').max(160),
  role: z.string().max(120).optional().or(z.literal('')),
  description: z.string().min(20, 'Add a fuller description').max(8000),
  requiredSkills: z.string().min(1, 'List at least one required skill'), // comma-separated
  niceToHaveSkills: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  remoteOk: z.boolean().optional(),
  stipendAmount: z.coerce.number().min(0).optional(),
  stipendCurrency: z.string().default('INR'),
  stipendPeriod: z.string().default('month'),
  duration: z.string().optional().or(z.literal('')),
  openings: z.coerce.number().min(1).max(999),
  minYear: z.coerce.number().min(1).max(6).optional(),
  maxYear: z.coerce.number().min(1).max(6).optional(),
  deadline: z.string().optional().or(z.literal('')),
});
export type InternshipValues = z.infer<typeof internshipSchema>;

export const applySchema = z.object({
  coverLetter: z.string().max(3000).optional().or(z.literal('')),
});
export type ApplyValues = z.infer<typeof applySchema>;
