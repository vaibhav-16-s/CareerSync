// ============================================================================
// CareerSync — shared frontend types (mirror of the backend contract)
// ============================================================================

// ---------- Enums ----------
export enum UserRole {
  STUDENT = 'student',
  COMPANY = 'company',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  PENDING = 'pending',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum InternshipStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
  REMOVED = 'removed',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
  HIRED = 'hired',
  WITHDRAWN = 'withdrawn',
}

export enum Proficiency {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum NotificationType {
  APPLICATION_STATUS = 'application_status',
  NEW_APPLICANT = 'new_applicant',
  NEW_MATCH = 'new_match',
  COMPANY_VERIFIED = 'company_verified',
  SYSTEM = 'system',
}

// ---------- API envelope ----------
export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ path?: string; message: string }> | unknown;
  };
}

export interface Paginated<T> {
  items: T[];
  meta: ApiMeta;
}

// ---------- Auth ----------
export interface AuthUser {
  id: string;
  _id?: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole.STUDENT | UserRole.COMPANY;
  name: string;
}

// ---------- Student ----------
export interface Skill {
  skillId: string;
  name: string;
  proficiency: Proficiency;
  selfRating?: number;
}

export interface Education {
  degree: string;
  college: string;
  startYear?: number;
  endYear?: number;
  gpa?: number;
}

export interface Project {
  title: string;
  description?: string;
  techStack: string[];
  link?: string;
}

export interface Certification {
  name: string;
  issuer?: string;
  url?: string;
  date?: string;
}

export interface ResumeInfo {
  fileUrl?: string;
  publicId?: string;
  parseStatus: 'none' | 'pending' | 'done' | 'failed';
  version: number;
  uploadedAt?: string;
}

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface Student {
  _id: string;
  userId: string;
  name: string;
  headline?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: string;
  location: { city?: string; country?: string; remoteOk: boolean };
  yearOfStudy?: number;
  college?: string;
  bio?: string;
  links: { github?: string; portfolio?: string; linkedin?: string };
  skills: Skill[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  resume: ResumeInfo;
  profileCompleteness: number;
  jobSeekingStatus: 'active' | 'passive' | 'closed';
  consent: { candidateDiscovery: boolean; dataProcessing: boolean };
  whatsappNumber?: string;
  notificationPreferences: {
    email: { applicationUpdates: boolean; newMatches: boolean };
    whatsapp: { enabled: boolean; applicationUpdates: boolean; newMatches: boolean };
  };
  createdAt: string;
  updatedAt: string;
}

export interface StudentDashboard {
  profileCompleteness: number;
  jobSeekingStatus: 'active' | 'passive' | 'closed';
  applicationPipeline: Record<ApplicationStatus | string, number>;
  savedCount: number;
  activeInternships: number;
  skillsCount: number;
  hasResume: boolean;
}

// ---------- Company ----------
export interface Company {
  _id: string;
  userId: string;
  name: string;
  logoUrl?: string;
  logoPublicId?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  founder?: string;
  foundedYear?: number;
  headquarters?: string;
  email?: string;
  socials?: { linkedin?: string; twitter?: string };
  leadership?: { name: string; title?: string }[];
  location: { city?: string; country?: string };
  verification: {
    status: VerificationStatus;
    docs: { name: string; url: string }[];
    verifiedAt?: string | null;
    reason?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CompanyAnalytics {
  verification: VerificationStatus;
  internships: {
    total: number;
    active: number;
    totalViews: number;
    totalApplications: number;
  };
  applicationFunnel: Record<string, number>;
  averageMatchScore: number;
  topInternships: { _id: string; title: string; stats: InternshipStats }[];
}

// ---------- Internship ----------
export interface RequiredSkill {
  skillId: string;
  name: string;
  weight: number;
  minProficiency: Proficiency;
}

export interface InternshipStats {
  views: number;
  applications: number;
  shortlists: number;
}

export interface Internship {
  _id: string;
  companyId: string | Company;
  createdBy: string;
  title: string;
  description: string;
  role?: string;
  requiredSkills: RequiredSkill[];
  niceToHaveSkills: { skillId: string; name: string }[];
  eligibility: { minYear?: number; maxYear?: number };
  location: { city?: string; remoteOk: boolean };
  stipend: { amount: number; currency: string; period: string };
  duration?: string;
  openings: number;
  deadline?: string;
  status: InternshipStatus;
  stats: InternshipStats;
  createdAt: string;
  updatedAt: string;
}

export interface InternshipFilters {
  q?: string;
  skills?: string;
  city?: string;
  remote?: boolean;
  minStipend?: number;
  year?: number;
  company?: string;
  sort?: 'recent' | 'stipend' | 'deadline' | string;
  page?: number;
  limit?: number;
}

// ---------- Application ----------
export interface StatusHistory {
  status: ApplicationStatus;
  at: string;
  byUserId?: string;
  note?: string;
}

export interface CompanyNote {
  text: string;
  byUserId: string;
  at: string;
}

export interface ApplicationSnapshot {
  name: string;
  headline?: string;
  skills: { name: string; proficiency: string }[];
  projects: { title: string; techStack: string[] }[];
  resumeUrl?: string;
}

export interface Application {
  _id: string;
  internshipId: string | Internship;
  studentId: string | Student;
  companyId: string | Company;
  status: ApplicationStatus;
  matchScore: number;
  matchBreakdown?: Record<string, unknown>;
  coverLetter?: string;
  snapshot: ApplicationSnapshot;
  statusHistory: StatusHistory[];
  companyNotes: CompanyNote[];
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicantBoard {
  board: Record<string, Application[]>;
  total: number;
}

// ---------- AI ----------
export interface MatchResult {
  score: number;
  breakdown?: Record<string, number>;
  explanation?: string;
  matchedSkills?: string[];
  missingSkills?: string[];
  [key: string]: unknown;
}

export interface SkillGapResult {
  missingSkills: { name: string; importance?: number }[];
  matchedSkills?: { name: string }[];
  learningPath?: { skill: string; resources?: string[] }[];
  coverage?: number;
  explanation?: string;
  [key: string]: unknown;
}

export interface Recommendation {
  internship: Internship;
  score: number;
  reasons?: string[];
}

export interface ResumeFeedback {
  score?: number;
  strengths?: string[];
  improvements?: string[];
  summary?: string;
  [key: string]: unknown;
}

// ---------- Resume Intelligence ----------
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type ResumeStrength = 'weak' | 'fair' | 'good' | 'strong' | 'excellent';

export interface CategoryScore {
  key: string;
  label: string;
  score: number;
  weight: number;
  explanation: string;
  suggestions: string[];
  priority: Priority;
}
export interface AtsCheck { key: string; label: string; passed: boolean; detail: string }
export interface AtsReport { score: number; checks: AtsCheck[]; issues: string[] }
export interface ResumeSectionReport {
  key: string; label: string; present: boolean; complete: boolean;
  needsImprovement: boolean; suggestions: string[];
}
export interface SkillsReport {
  frontend: string[]; backend: string[]; database: string[]; cloud: string[];
  devops: string[]; languages: string[]; frameworks: string[]; tools: string[];
  all: string[]; missing: string[]; trending: string[];
}
export interface KeywordReport {
  matched: string[]; missing: string[]; weak: string[]; recommended: string[]; density: number;
}
export interface GrammarReport {
  score: number; actionVerbCount: number; passiveVoiceCount: number;
  repeatedWords: { word: string; count: number }[]; longParagraphs: number;
  weakPhrases: string[]; issues: { type: string; text: string; suggestion: string }[];
}
export interface ContactReport {
  email?: string; phone?: string; github?: string; linkedin?: string; portfolio?: string;
}
export interface ResumeSuggestion {
  priority: Priority; title: string; why: string; how: string; expectedGain: number;
}
export interface ResumeReport {
  overallScore: number;
  readinessScore: number;
  strength: ResumeStrength;
  categories: CategoryScore[];
  ats: AtsReport;
  sections: ResumeSectionReport[];
  skills: SkillsReport;
  keywords: KeywordReport;
  grammar: GrammarReport;
  contact: ContactReport;
  suggestions: ResumeSuggestion[];
  engine: 'rule-based' | 'ai-enhanced';
  meta: { wordCount: number; pageCount?: number };
}
export interface ResumeScores {
  overall: number; ats: number; grammar: number; keyword: number; skill: number;
}
export interface ResumeVersion {
  _id: string;
  version: number;
  file: { fileUrl?: string; originalName: string; mimeType: string; sizeBytes: number };
  wordCount: number;
  pageCount?: number;
  status: 'parsed' | 'analyzing' | 'analyzed' | 'failed';
  report?: ResumeReport;
  scores: ResumeScores;
  rewrite?: Record<string, unknown> | null;
  analyzedAt?: string;
  createdAt: string;
}
export interface ResumeDashboard {
  hasResume: boolean;
  latest: {
    id: string;
    version: number;
    scores: ResumeScores;
    strength?: ResumeStrength;
    readinessScore?: number;
    categories?: CategoryScore[];
    suggestions?: ResumeSuggestion[];
    engine?: string;
  } | null;
  history: Array<{ version: number; date: string; overall: number; ats: number; grammar: number; keyword: number; skill: number }>;
  totalVersions: number;
  improvement: number;
}

// ---------- Notifications ----------
export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

// ---------- Admin ----------
export interface PlatformAnalytics {
  users: number;
  students: number;
  companies: number;
  activeInternships: number;
  applications: number;
  successfulHires: number;
  pendingVerifications: number;
  liquidity: number;
}

export interface ActivityLog {
  _id: string;
  actorId?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
