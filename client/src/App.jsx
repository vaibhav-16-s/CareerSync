import { Routes, Route, Outlet } from 'react-router-dom';
import { RouteGuard } from '@/components/auth/route-guard';

// Layouts (were Next.js route-group layouts — URLs are unchanged, the groups
// were never part of the path).
import AuthLayout from '@/pages/auth/AuthLayout';
import StudentLayout from '@/pages/student/StudentLayout';
import CompanyLayout from '@/pages/company/CompanyLayout';

// Root-level pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Story from '@/pages/Story';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';

// Auth
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';

// Student
import StudentDashboard from '@/pages/student/Dashboard';
import StudentSearch from '@/pages/student/Search';
import StudentApplications from '@/pages/student/Applications';
import StudentSaved from '@/pages/student/Saved';
import StudentProfile from '@/pages/student/Profile';
import StudentSkills from '@/pages/student/Skills';
import StudentCourses from '@/pages/student/Courses';
import StudentProjects from '@/pages/student/Projects';
import StudentCertifications from '@/pages/student/Certifications';
import StudentResume from '@/pages/student/Resume';
import StudentResumeBuild from '@/pages/student/ResumeBuild';
import StudentResumeDetail from '@/pages/student/ResumeDetail';
import StudentInternshipDetail from '@/pages/student/InternshipDetail';
import StudentNotifications from '@/pages/student/Notifications';
import StudentHelp from '@/pages/student/Help';
import StudentSettings from '@/pages/student/Settings';

// Company
import CompanyDashboard from '@/pages/company/Dashboard';
import CompanyInternships from '@/pages/company/Internships';
import CompanyInternshipNew from '@/pages/company/InternshipNew';
import CompanyApplicants from '@/pages/company/Applicants';
import CompanyPipeline from '@/pages/company/Pipeline';
import CompanyAnalytics from '@/pages/company/Analytics';
import CompanyProfile from '@/pages/company/Profile';
import CompanyNotifications from '@/pages/company/Notifications';
import CompanyHelp from '@/pages/company/Help';
import CompanySettings from '@/pages/company/Settings';

// Next.js layouts received `children`; React Router supplies them via <Outlet/>.
const withOutlet = (Layout) => (
  <Layout>
    <Outlet />
  </Layout>
);

export default function App() {
  return (
    <RouteGuard>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/story" element={<Story />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth */}
        <Route element={withOutlet(AuthLayout)}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Student */}
        <Route element={withOutlet(StudentLayout)}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/search" element={<StudentSearch />} />
          <Route path="/student/applications" element={<StudentApplications />} />
          <Route path="/student/saved" element={<StudentSaved />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/skills" element={<StudentSkills />} />
          <Route path="/student/courses" element={<StudentCourses />} />
          <Route path="/student/projects" element={<StudentProjects />} />
          <Route path="/student/certifications" element={<StudentCertifications />} />
          <Route path="/student/resume" element={<StudentResume />} />
          <Route path="/student/resume/build" element={<StudentResumeBuild />} />
          <Route path="/student/resume/:id" element={<StudentResumeDetail />} />
          <Route path="/student/internships/:id" element={<StudentInternshipDetail />} />
          <Route path="/student/notifications" element={<StudentNotifications />} />
          <Route path="/student/help" element={<StudentHelp />} />
          <Route path="/student/settings" element={<StudentSettings />} />
        </Route>

        {/* Company */}
        <Route element={withOutlet(CompanyLayout)}>
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/internships" element={<CompanyInternships />} />
          <Route path="/company/internships/new" element={<CompanyInternshipNew />} />
          <Route path="/company/applicants" element={<CompanyApplicants />} />
          <Route path="/company/pipeline" element={<CompanyPipeline />} />
          <Route path="/company/analytics" element={<CompanyAnalytics />} />
          <Route path="/company/profile" element={<CompanyProfile />} />
          <Route path="/company/notifications" element={<CompanyNotifications />} />
          <Route path="/company/help" element={<CompanyHelp />} />
          <Route path="/company/settings" element={<CompanySettings />} />
        </Route>

        {/* 404 — was app/not-found.tsx */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RouteGuard>
  );
}
