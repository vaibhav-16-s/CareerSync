/* eslint-disable no-console */
import { connectDB, disconnectDB } from '../config/db';
import { User } from '../models/User';
import { Student, IStudent } from '../models/Student';
import { Company, ICompany } from '../models/Company';
import { Internship, IInternship } from '../models/Internship';
import { Application } from '../models/Application';
import { hashPassword } from '../utils/password';
import { computeMatch } from '../utils/matching';
import {
  UserRole,
  UserStatus,
  VerificationStatus,
  Proficiency,
  InternshipStatus,
  ApplicationStatus,
} from '../types';

const DAY = 24 * 60 * 60 * 1000;

async function seed(): Promise<void> {
  await connectDB();
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Company.deleteMany({}),
    Internship.deleteMany({}),
    Application.deleteMany({}),
  ]);

  const password = await hashPassword('Password123');

  // ---------- Admin ----------
  await User.create({
    email: 'admin@internbridge.com',
    passwordHash: password,
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    emailVerified: true,
  });

  // ---------- Students ----------
  const studentSeeds = [
    {
      email: 'student@example.com',
      name: 'Aarav Sharma',
      headline: '2nd-year CSE | Python & React enthusiast',
      yearOfStudy: 2,
      college: 'XYZ Institute of Technology',
      location: { city: 'Bengaluru', country: 'India', remoteOk: true },
      bio: 'Building small full-stack projects and learning how real products are shipped.',
      skills: [
        { skillId: 'python', name: 'Python', proficiency: Proficiency.INTERMEDIATE },
        { skillId: 'react', name: 'React', proficiency: Proficiency.BEGINNER },
        { skillId: 'html', name: 'HTML', proficiency: Proficiency.ADVANCED },
        { skillId: 'css', name: 'CSS', proficiency: Proficiency.INTERMEDIATE },
      ],
      projects: [
        { title: 'Portfolio Website', description: 'Personal site built with React.', techStack: ['react', 'css'], link: '' },
        { title: 'Expense Tracker', description: 'CLI expense tracker in Python.', techStack: ['python'], link: '' },
      ],
      profileCompleteness: 78,
    },
    {
      email: 'priya.patel@example.com',
      name: 'Priya Patel',
      headline: '3rd-year IT | Data enthusiast, loves SQL & dashboards',
      yearOfStudy: 3,
      college: 'National Institute of Technology',
      location: { city: 'Pune', country: 'India', remoteOk: true },
      bio: 'Exploring data analytics and machine learning through college projects and Kaggle.',
      skills: [
        { skillId: 'python', name: 'Python', proficiency: Proficiency.ADVANCED },
        { skillId: 'sql', name: 'SQL', proficiency: Proficiency.ADVANCED },
        { skillId: 'pandas', name: 'Pandas', proficiency: Proficiency.INTERMEDIATE },
        { skillId: 'excel', name: 'Excel', proficiency: Proficiency.ADVANCED },
      ],
      projects: [
        { title: 'Sales Dashboard', description: 'Interactive sales dashboard using Pandas + Plotly.', techStack: ['python', 'pandas'], link: '' },
      ],
      profileCompleteness: 85,
    },
    {
      email: 'rohan.verma@example.com',
      name: 'Rohan Verma',
      headline: 'Final-year CSE | Full-stack developer',
      yearOfStudy: 4,
      college: 'XYZ Institute of Technology',
      location: { city: 'Remote', country: 'India', remoteOk: true },
      bio: 'Two years of freelance full-stack work, now looking for a proper internship to grow.',
      skills: [
        { skillId: 'react', name: 'React', proficiency: Proficiency.ADVANCED },
        { skillId: 'node', name: 'Node.js', proficiency: Proficiency.ADVANCED },
        { skillId: 'mongodb', name: 'MongoDB', proficiency: Proficiency.INTERMEDIATE },
        { skillId: 'html', name: 'HTML', proficiency: Proficiency.ADVANCED },
      ],
      projects: [
        { title: 'Freelance Booking App', description: 'MERN app for booking freelance services.', techStack: ['react', 'node', 'mongodb'], link: '' },
        { title: 'Realtime Chat', description: 'Socket.io based chat application.', techStack: ['node', 'react'], link: '' },
      ],
      profileCompleteness: 92,
    },
    {
      email: 'sneha.iyer@example.com',
      name: 'Sneha Iyer',
      headline: '2nd-year Design | UI/UX & frontend',
      yearOfStudy: 2,
      college: 'School of Design & Technology',
      location: { city: 'Mumbai', country: 'India', remoteOk: true },
      bio: 'Design student who codes — into clean interfaces and accessible design systems.',
      skills: [
        { skillId: 'figma', name: 'Figma', proficiency: Proficiency.ADVANCED },
        { skillId: 'css', name: 'CSS', proficiency: Proficiency.INTERMEDIATE },
        { skillId: 'javascript', name: 'JavaScript', proficiency: Proficiency.BEGINNER },
      ],
      projects: [
        { title: 'Design System Kit', description: 'Reusable Figma + CSS component kit.', techStack: ['figma', 'css'], link: '' },
      ],
      profileCompleteness: 65,
    },
    {
      email: 'karan.mehta@example.com',
      name: 'Karan Mehta',
      headline: '3rd-year CSE | Backend & systems',
      yearOfStudy: 3,
      college: 'Indian Institute of Information Technology',
      location: { city: 'Hyderabad', country: 'India', remoteOk: false },
      bio: 'Interested in backend systems, APIs and cloud infrastructure.',
      skills: [
        { skillId: 'java', name: 'Java', proficiency: Proficiency.ADVANCED },
        { skillId: 'spring', name: 'Spring Boot', proficiency: Proficiency.INTERMEDIATE },
        { skillId: 'docker', name: 'Docker', proficiency: Proficiency.BEGINNER },
      ],
      projects: [
        { title: 'Library Management API', description: 'REST API built with Spring Boot.', techStack: ['java', 'spring'], link: '' },
      ],
      profileCompleteness: 70,
    },
    {
      email: 'isha.gupta@example.com',
      name: 'Isha Gupta',
      headline: '1st-year CSE | Curious about mobile apps',
      yearOfStudy: 1,
      college: 'XYZ Institute of Technology',
      location: { city: 'Delhi', country: 'India', remoteOk: true },
      bio: 'Just starting out — building small Flutter apps to learn mobile development.',
      skills: [
        { skillId: 'flutter', name: 'Flutter', proficiency: Proficiency.BEGINNER },
        { skillId: 'dart', name: 'Dart', proficiency: Proficiency.BEGINNER },
        { skillId: 'python', name: 'Python', proficiency: Proficiency.BEGINNER },
      ],
      projects: [
        { title: 'Habit Tracker App', description: 'Simple Flutter habit tracking app.', techStack: ['flutter', 'dart'], link: '' },
      ],
      profileCompleteness: 45,
    },
    {
      email: 'aditya.nair@example.com',
      name: 'Aditya Nair',
      headline: '4th-year CSE | Cloud & DevOps enthusiast',
      yearOfStudy: 4,
      college: 'National Institute of Technology',
      location: { city: 'Chennai', country: 'India', remoteOk: true },
      bio: 'Automating everything. Comfortable with CI/CD pipelines and cloud deployments.',
      skills: [
        { skillId: 'docker', name: 'Docker', proficiency: Proficiency.ADVANCED },
        { skillId: 'aws', name: 'AWS', proficiency: Proficiency.INTERMEDIATE },
        { skillId: 'python', name: 'Python', proficiency: Proficiency.INTERMEDIATE },
      ],
      projects: [
        { title: 'CI/CD Pipeline Template', description: 'Reusable GitHub Actions + Docker deploy pipeline.', techStack: ['docker', 'aws'], link: '' },
      ],
      profileCompleteness: 88,
    },
    {
      email: 'vikram.singh@example.com',
      name: 'Vikram Singh',
      headline: '3rd-year ECE | Embedded systems & IoT',
      yearOfStudy: 3,
      college: 'Indian Institute of Information Technology',
      location: { city: 'Hyderabad', country: 'India', remoteOk: false },
      bio: 'Fascinated by hardware-software interfaces — building IoT prototypes with Arduino and Raspberry Pi.',
      skills: [
        { skillId: 'c', name: 'C', proficiency: Proficiency.ADVANCED },
        { skillId: 'embedded-c', name: 'Embedded C', proficiency: Proficiency.INTERMEDIATE },
        { skillId: 'python', name: 'Python', proficiency: Proficiency.BEGINNER },
      ],
      projects: [
        { title: 'Smart Irrigation System', description: 'Arduino-based soil moisture sensor with automated watering.', techStack: ['c', 'embedded-c'], link: '' },
      ],
      profileCompleteness: 60,
    },
    {
      email: 'ananya.reddy@example.com',
      name: 'Ananya Reddy',
      headline: '1st-year CSE | Learning web development',
      yearOfStudy: 1,
      college: 'National Institute of Technology',
      location: { city: 'Pune', country: 'India', remoteOk: true },
      bio: 'New to coding, excited about building my first real websites.',
      skills: [
        { skillId: 'html', name: 'HTML', proficiency: Proficiency.BEGINNER },
        { skillId: 'css', name: 'CSS', proficiency: Proficiency.BEGINNER },
        { skillId: 'javascript', name: 'JavaScript', proficiency: Proficiency.BEGINNER },
      ],
      projects: [
        { title: 'Recipe Finder', description: 'Simple HTML/CSS/JS site that searches a recipe API.', techStack: ['html', 'css', 'javascript'], link: '' },
      ],
      profileCompleteness: 40,
    },
    {
      email: 'farhan.ali@example.com',
      name: 'Farhan Ali',
      headline: 'Final-year CSE | Android developer',
      yearOfStudy: 4,
      college: 'School of Design & Technology',
      location: { city: 'Bengaluru', country: 'India', remoteOk: true },
      bio: 'Published two apps on the Play Store, looking to work on production-scale mobile products.',
      skills: [
        { skillId: 'kotlin', name: 'Kotlin', proficiency: Proficiency.ADVANCED },
        { skillId: 'java', name: 'Java', proficiency: Proficiency.INTERMEDIATE },
        { skillId: 'firebase', name: 'Firebase', proficiency: Proficiency.INTERMEDIATE },
      ],
      projects: [
        { title: 'Campus Events App', description: 'Android app for tracking college events, 500+ downloads.', techStack: ['kotlin', 'firebase'], link: '' },
        { title: 'Budget Buddy', description: 'Personal finance tracker app in Kotlin.', techStack: ['kotlin'], link: '' },
      ],
      profileCompleteness: 90,
    },
  ];

  const students: IStudent[] = [];
  for (const s of studentSeeds) {
    const user = await User.create({
      email: s.email,
      passwordHash: password,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    });
    const student = await Student.create({
      userId: user._id,
      name: s.name,
      headline: s.headline,
      yearOfStudy: s.yearOfStudy,
      college: s.college,
      location: s.location,
      bio: s.bio,
      skills: s.skills,
      projects: s.projects,
      profileCompleteness: s.profileCompleteness,
    });
    students.push(student);
  }
  const [aarav, priya, rohan, sneha, karan, isha, aditya, vikram, ananya, farhan] = students;

  // ---------- Companies ----------
  const companySeeds = [
    {
      email: 'company@example.com',
      name: 'TechStart Labs',
      description: 'A fast-growing startup building developer tools.',
      industry: 'Software',
      size: '11-50',
      headquarters: 'Bengaluru, India',
      location: { city: 'Bengaluru', country: 'India' },
      verification: { status: VerificationStatus.VERIFIED, docs: [], verifiedAt: new Date() },
    },
    {
      email: 'hr@datawave.example.com',
      name: 'DataWave Analytics',
      description: 'We help businesses make sense of their data through analytics and ML.',
      industry: 'Data & AI',
      size: '51-200',
      headquarters: 'Pune, India',
      location: { city: 'Pune', country: 'India' },
      verification: { status: VerificationStatus.VERIFIED, docs: [], verifiedAt: new Date() },
    },
    {
      email: 'hr@cloudify.example.com',
      name: 'Cloudify Systems',
      description: 'Cloud infrastructure and DevOps consulting for growing startups.',
      industry: 'Cloud & DevOps',
      size: '1-10',
      headquarters: 'Chennai, India',
      location: { city: 'Chennai', country: 'India' },
      verification: { status: VerificationStatus.PENDING, docs: [{ name: 'incorporation.pdf', url: 'https://example.com/docs/incorporation.pdf' }] },
    },
    {
      email: 'hr@pixelcraft.example.com',
      name: 'PixelCraft Studio',
      description: 'A design-led product studio crafting delightful digital experiences.',
      industry: 'Design',
      size: '11-50',
      headquarters: 'Mumbai, India',
      location: { city: 'Mumbai', country: 'India' },
      verification: { status: VerificationStatus.VERIFIED, docs: [], verifiedAt: new Date() },
    },
    {
      email: 'hr@neobank.example.com',
      name: 'NeoBank Fintech',
      description: 'Digital-first banking platform for young professionals.',
      industry: 'Fintech',
      size: '51-200',
      headquarters: 'Bengaluru, India',
      location: { city: 'Bengaluru', country: 'India' },
      verification: { status: VerificationStatus.VERIFIED, docs: [], verifiedAt: new Date() },
    },
    {
      email: 'hr@greengrid.example.com',
      name: 'GreenGrid Energy',
      description: 'IoT and clean-tech solutions for smart energy grids.',
      industry: 'CleanTech',
      size: '11-50',
      headquarters: 'Hyderabad, India',
      location: { city: 'Hyderabad', country: 'India' },
      verification: { status: VerificationStatus.PENDING, docs: [{ name: 'incorporation.pdf', url: 'https://example.com/docs/incorporation.pdf' }] },
    },
  ];

  const companies: { company: ICompany; userId: string }[] = [];
  for (const c of companySeeds) {
    const user = await User.create({
      email: c.email,
      passwordHash: password,
      role: UserRole.COMPANY,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    });
    const company = await Company.create({
      userId: user._id,
      name: c.name,
      description: c.description,
      industry: c.industry,
      size: c.size,
      headquarters: c.headquarters,
      location: c.location,
      verification: c.verification,
    });
    companies.push({ company, userId: String(user._id) });
  }
  const [techstart, datawave, cloudify, pixelcraft, neobank, greengrid] = companies;

  // ---------- Internships ----------
  const internshipSeeds: {
    owner: { company: ICompany; userId: string };
    title: string;
    description: string;
    role: string;
    requiredSkills: { skillId: string; name: string; weight: number; minProficiency: Proficiency }[];
    eligibility: { minYear: number; maxYear: number };
    location: { city: string; remoteOk: boolean };
    stipend: { amount: number; currency: string; period: string };
    duration: string;
    openings: number;
    deadlineInDays: number;
  }[] = [
    {
      owner: techstart,
      title: 'Frontend Developer Intern',
      description: 'Work on our React-based dashboard. Great for early-year students.',
      role: 'Frontend',
      requiredSkills: [
        { skillId: 'react', name: 'React', weight: 2, minProficiency: Proficiency.BEGINNER },
        { skillId: 'html', name: 'HTML', weight: 1, minProficiency: Proficiency.INTERMEDIATE },
      ],
      eligibility: { minYear: 1, maxYear: 4 },
      location: { city: 'Remote', remoteOk: true },
      stipend: { amount: 10000, currency: 'INR', period: 'month' },
      duration: '3 months',
      openings: 2,
      deadlineInDays: 30,
    },
    {
      owner: techstart,
      title: 'Python Backend Intern',
      description: 'Help build our REST APIs in Python.',
      role: 'Backend',
      requiredSkills: [{ skillId: 'python', name: 'Python', weight: 2, minProficiency: Proficiency.INTERMEDIATE }],
      eligibility: { minYear: 2, maxYear: 4 },
      location: { city: 'Bengaluru', remoteOk: false },
      stipend: { amount: 15000, currency: 'INR', period: 'month' },
      duration: '6 months',
      openings: 1,
      deadlineInDays: 20,
    },
    {
      owner: datawave,
      title: 'Data Analyst Intern',
      description: 'Analyze customer data and build dashboards for our clients.',
      role: 'Data',
      requiredSkills: [
        { skillId: 'sql', name: 'SQL', weight: 2, minProficiency: Proficiency.INTERMEDIATE },
        { skillId: 'python', name: 'Python', weight: 1, minProficiency: Proficiency.BEGINNER },
      ],
      eligibility: { minYear: 2, maxYear: 4 },
      location: { city: 'Pune', remoteOk: true },
      stipend: { amount: 12000, currency: 'INR', period: 'month' },
      duration: '4 months',
      openings: 2,
      deadlineInDays: 25,
    },
    {
      owner: datawave,
      title: 'Machine Learning Intern',
      description: 'Assist in building and evaluating ML models for churn prediction.',
      role: 'Machine Learning',
      requiredSkills: [{ skillId: 'python', name: 'Python', weight: 2, minProficiency: Proficiency.INTERMEDIATE }],
      eligibility: { minYear: 3, maxYear: 4 },
      location: { city: 'Remote', remoteOk: true },
      stipend: { amount: 18000, currency: 'INR', period: 'month' },
      duration: '6 months',
      openings: 1,
      deadlineInDays: 15,
    },
    {
      owner: cloudify,
      title: 'DevOps Intern',
      description: 'Help automate deployments and manage CI/CD pipelines.',
      role: 'DevOps',
      requiredSkills: [{ skillId: 'docker', name: 'Docker', weight: 2, minProficiency: Proficiency.BEGINNER }],
      eligibility: { minYear: 3, maxYear: 4 },
      location: { city: 'Chennai', remoteOk: false },
      stipend: { amount: 14000, currency: 'INR', period: 'month' },
      duration: '3 months',
      openings: 1,
      deadlineInDays: 18,
    },
    {
      owner: cloudify,
      title: 'Cloud Support Intern',
      description: 'Support our team in managing AWS infrastructure for clients.',
      role: 'Cloud',
      requiredSkills: [{ skillId: 'aws', name: 'AWS', weight: 2, minProficiency: Proficiency.BEGINNER }],
      eligibility: { minYear: 2, maxYear: 4 },
      location: { city: 'Remote', remoteOk: true },
      stipend: { amount: 13000, currency: 'INR', period: 'month' },
      duration: '3 months',
      openings: 2,
      deadlineInDays: 22,
    },
    {
      owner: pixelcraft,
      title: 'UI/UX Design Intern',
      description: 'Design user flows and interfaces for our client products.',
      role: 'Design',
      requiredSkills: [{ skillId: 'figma', name: 'Figma', weight: 2, minProficiency: Proficiency.BEGINNER }],
      eligibility: { minYear: 1, maxYear: 4 },
      location: { city: 'Mumbai', remoteOk: true },
      stipend: { amount: 8000, currency: 'INR', period: 'month' },
      duration: '3 months',
      openings: 2,
      deadlineInDays: 28,
    },
    {
      owner: pixelcraft,
      title: 'Frontend Intern (React)',
      description: 'Bring our Figma designs to life with pixel-perfect React components.',
      role: 'Frontend',
      requiredSkills: [
        { skillId: 'react', name: 'React', weight: 1, minProficiency: Proficiency.BEGINNER },
        { skillId: 'css', name: 'CSS', weight: 2, minProficiency: Proficiency.INTERMEDIATE },
      ],
      eligibility: { minYear: 2, maxYear: 4 },
      location: { city: 'Remote', remoteOk: true },
      stipend: { amount: 11000, currency: 'INR', period: 'month' },
      duration: '4 months',
      openings: 1,
      deadlineInDays: 12,
    },
    {
      owner: neobank,
      title: 'Backend Intern (Node.js)',
      description: 'Build secure APIs for our digital banking product.',
      role: 'Backend',
      requiredSkills: [{ skillId: 'node', name: 'Node.js', weight: 2, minProficiency: Proficiency.INTERMEDIATE }],
      eligibility: { minYear: 3, maxYear: 4 },
      location: { city: 'Bengaluru', remoteOk: false },
      stipend: { amount: 20000, currency: 'INR', period: 'month' },
      duration: '6 months',
      openings: 1,
      deadlineInDays: 21,
    },
    {
      owner: neobank,
      title: 'QA Intern',
      description: 'Write automated test suites for our banking APIs and mobile app.',
      role: 'QA',
      requiredSkills: [{ skillId: 'javascript', name: 'JavaScript', weight: 1, minProficiency: Proficiency.BEGINNER }],
      eligibility: { minYear: 1, maxYear: 4 },
      location: { city: 'Remote', remoteOk: true },
      stipend: { amount: 9000, currency: 'INR', period: 'month' },
      duration: '3 months',
      openings: 2,
      deadlineInDays: 26,
    },
    {
      owner: greengrid,
      title: 'IoT Intern',
      description: 'Prototype sensor firmware for smart-grid monitoring devices.',
      role: 'IoT',
      requiredSkills: [{ skillId: 'embedded-c', name: 'Embedded C', weight: 2, minProficiency: Proficiency.BEGINNER }],
      eligibility: { minYear: 2, maxYear: 4 },
      location: { city: 'Hyderabad', remoteOk: false },
      stipend: { amount: 12000, currency: 'INR', period: 'month' },
      duration: '4 months',
      openings: 1,
      deadlineInDays: 19,
    },
    {
      owner: greengrid,
      title: 'Mobile App Intern (Android)',
      description: 'Build the companion Android app for our smart-grid dashboards.',
      role: 'Mobile',
      requiredSkills: [{ skillId: 'kotlin', name: 'Kotlin', weight: 2, minProficiency: Proficiency.INTERMEDIATE }],
      eligibility: { minYear: 3, maxYear: 4 },
      location: { city: 'Remote', remoteOk: true },
      stipend: { amount: 16000, currency: 'INR', period: 'month' },
      duration: '4 months',
      openings: 1,
      deadlineInDays: 24,
    },
  ];

  const internships: IInternship[] = [];
  for (const i of internshipSeeds) {
    const internship = await Internship.create({
      companyId: i.owner.company._id,
      createdBy: i.owner.userId,
      title: i.title,
      description: i.description,
      role: i.role,
      requiredSkills: i.requiredSkills,
      eligibility: i.eligibility,
      location: i.location,
      stipend: i.stipend,
      duration: i.duration,
      openings: i.openings,
      deadline: new Date(Date.now() + i.deadlineInDays * DAY),
      status: InternshipStatus.ACTIVE,
    });
    internships.push(internship);
  }
  const [
    techstartFrontend,
    techstartBackend,
    datawaveAnalyst,
    datawaveML,
    cloudifyDevOps,
    cloudifyCloud,
    pixelcraftDesign,
    pixelcraftFrontend,
    neobankBackend,
    neobankQA,
    greengridIoT,
    greengridMobile,
  ] = internships;

  // ---------- Applications ----------
  // Each entry drives a student through a realistic status history so the
  // company dashboards (funnel, breakdown, key metrics) have varied demo data.
  const applicationSeeds: { student: IStudent; internship: IInternship; status: ApplicationStatus }[] = [
    // TechStart Labs — the primary demo company login gets the richest funnel.
    { student: aarav, internship: techstartFrontend, status: ApplicationStatus.SHORTLISTED },
    { student: rohan, internship: techstartFrontend, status: ApplicationStatus.HIRED },
    { student: sneha, internship: techstartFrontend, status: ApplicationStatus.PENDING },
    { student: priya, internship: techstartFrontend, status: ApplicationStatus.REJECTED },
    { student: karan, internship: techstartBackend, status: ApplicationStatus.PENDING },
    { student: isha, internship: techstartBackend, status: ApplicationStatus.REJECTED },
    { student: aditya, internship: techstartBackend, status: ApplicationStatus.SHORTLISTED },
    { student: aarav, internship: techstartBackend, status: ApplicationStatus.WITHDRAWN },

    // DataWave Analytics
    { student: priya, internship: datawaveAnalyst, status: ApplicationStatus.SHORTLISTED },
    { student: aarav, internship: datawaveAnalyst, status: ApplicationStatus.PENDING },
    { student: aditya, internship: datawaveML, status: ApplicationStatus.HIRED },
    { student: isha, internship: datawaveML, status: ApplicationStatus.PENDING },

    // Cloudify Systems
    { student: karan, internship: cloudifyDevOps, status: ApplicationStatus.PENDING },
    { student: aditya, internship: cloudifyCloud, status: ApplicationStatus.HIRED },
    { student: rohan, internship: cloudifyCloud, status: ApplicationStatus.REJECTED },

    // PixelCraft Studio
    { student: sneha, internship: pixelcraftDesign, status: ApplicationStatus.SHORTLISTED },
    { student: isha, internship: pixelcraftDesign, status: ApplicationStatus.PENDING },
    { student: rohan, internship: pixelcraftFrontend, status: ApplicationStatus.PENDING },
    { student: sneha, internship: pixelcraftFrontend, status: ApplicationStatus.WITHDRAWN },

    // NeoBank Fintech
    { student: rohan, internship: neobankBackend, status: ApplicationStatus.SHORTLISTED },
    { student: karan, internship: neobankBackend, status: ApplicationStatus.PENDING },
    { student: ananya, internship: neobankQA, status: ApplicationStatus.PENDING },
    { student: isha, internship: neobankQA, status: ApplicationStatus.HIRED },

    // GreenGrid Energy
    { student: vikram, internship: greengridIoT, status: ApplicationStatus.SHORTLISTED },
    { student: aditya, internship: greengridIoT, status: ApplicationStatus.PENDING },
    { student: farhan, internship: greengridMobile, status: ApplicationStatus.HIRED },
    { student: vikram, internship: greengridMobile, status: ApplicationStatus.REJECTED },
  ];

  function historyFor(status: ApplicationStatus, appliedAt: Date) {
    const history = [{ status: ApplicationStatus.PENDING, at: appliedAt }];
    if (status === ApplicationStatus.SHORTLISTED || status === ApplicationStatus.HIRED) {
      history.push({ status: ApplicationStatus.SHORTLISTED, at: new Date(appliedAt.getTime() + 2 * DAY) });
    }
    if (status === ApplicationStatus.HIRED) {
      history.push({ status: ApplicationStatus.HIRED, at: new Date(appliedAt.getTime() + 5 * DAY) });
    }
    if (status === ApplicationStatus.REJECTED) {
      history.push({ status: ApplicationStatus.REJECTED, at: new Date(appliedAt.getTime() + 3 * DAY) });
    }
    if (status === ApplicationStatus.WITHDRAWN) {
      history.push({ status: ApplicationStatus.WITHDRAWN, at: new Date(appliedAt.getTime() + 1 * DAY) });
    }
    return history;
  }

  for (const a of applicationSeeds) {
    const appliedAt = new Date(Date.now() - Math.floor(Math.random() * 10 + 1) * DAY);
    const match = computeMatch(a.student, a.internship);
    await Application.create({
      internshipId: a.internship._id,
      studentId: a.student._id,
      companyId: a.internship.companyId,
      status: a.status,
      matchScore: match.score,
      matchBreakdown: match,
      snapshot: {
        name: a.student.name,
        headline: a.student.headline,
        skills: a.student.skills.map((s) => ({ name: s.name, proficiency: s.proficiency })),
        projects: a.student.projects.map((p) => ({ title: p.title, techStack: p.techStack })),
      },
      statusHistory: historyFor(a.status, appliedAt),
      createdAt: appliedAt,
    });
  }

  // ---------- Internship stats ----------
  // Mirrors the app's real counters: `stats.applications` counts every apply
  // (never decremented on withdrawal), `stats.shortlists` counts applications
  // that ever reached "shortlisted", and `stats.views` is a plausible multiple
  // of applications since not every viewer applies.
  for (const internship of internships) {
    const apps = applicationSeeds.filter((a) => String(a.internship._id) === String(internship._id));
    const shortlists = apps.filter(
      (a) => a.status === ApplicationStatus.SHORTLISTED || a.status === ApplicationStatus.HIRED
    ).length;
    const views = apps.length * 3 + Math.floor(Math.random() * 8) + 2;
    await Internship.updateOne(
      { _id: internship._id },
      { $set: { 'stats.applications': apps.length, 'stats.shortlists': shortlists, 'stats.views': views } }
    );
  }

  console.log('Seed complete.');
  console.log(`Created ${students.length} students, ${companies.length} companies, ${internships.length} internships, ${applicationSeeds.length} applications.`);
  console.log('Logins (password: Password123):');
  console.log('  admin@internbridge.com');
  console.log('  student@example.com (Aarav Sharma)');
  console.log('  company@example.com (TechStart Labs)');
  console.log('  + more student/company demo accounts, see seed.ts');

  await disconnectDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
