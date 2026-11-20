import {
  LayoutDashboard,
  User,
  FileText,
  Sparkles,
  FolderGit2,
  Award,
  Search,
  Briefcase,
  Bell,
  Settings,
  Building2,
  PlusCircle,
  Users,
  BarChart3,
  GitBranch,
  ShieldCheck,
  GraduationCap,
  ScrollText,
  HelpCircle,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import { UserRole } from '@/types';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Find Internships', href: '/student/search', icon: Search },
  { label: 'Applications', href: '/student/applications', icon: Briefcase },
  { label: 'Profile', href: '/student/profile', icon: User },
  { label: 'Resume', href: '/student/resume', icon: FileText },
  { label: 'Skills', href: '/student/skills', icon: Sparkles },
  { label: 'Courses', href: '/student/courses', icon: BookOpen },
  { label: 'Projects', href: '/student/projects', icon: FolderGit2 },
  { label: 'Certifications', href: '/student/certifications', icon: Award },
  { label: 'Notifications', href: '/student/notifications', icon: Bell },
  { label: 'Help', href: '/student/help', icon: HelpCircle },
  { label: 'Settings', href: '/student/settings', icon: Settings },
];

export const COMPANY_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/company/dashboard', icon: LayoutDashboard },
  { label: 'Internships', href: '/company/internships', icon: Briefcase },
  { label: 'Post Internship', href: '/company/internships/new', icon: PlusCircle },
  { label: 'Applicants', href: '/company/applicants', icon: Users },
  { label: 'Hiring Pipeline', href: '/company/pipeline', icon: GitBranch },
  { label: 'Analytics', href: '/company/analytics', icon: BarChart3 },
  { label: 'Company Profile', href: '/company/profile', icon: Building2 },
  { label: 'Notifications', href: '/company/notifications', icon: Bell },
  { label: 'Help', href: '/company/help', icon: HelpCircle },
  { label: 'Settings', href: '/company/settings', icon: Settings },
];

export const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Students', href: '/admin/students', icon: GraduationCap },
  { label: 'Companies', href: '/admin/companies', icon: Building2 },
  { label: 'Verify Companies', href: '/admin/verify', icon: ShieldCheck },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Reports', href: '/admin/reports', icon: ScrollText },
  { label: 'Activity Logs', href: '/admin/logs', icon: ScrollText },
];

export function navForRole(role?: UserRole): NavItem[] {
  switch (role) {
    case UserRole.STUDENT:
      return STUDENT_NAV;
    case UserRole.COMPANY:
      return COMPANY_NAV;
    case UserRole.ADMIN:
      return ADMIN_NAV;
    default:
      return [];
  }
}
