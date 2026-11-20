import {
  Code2,
  Database,
  Megaphone,
  PenTool,
  Terminal,
  Cloud,
  BrainCircuit,
  MessagesSquare,
  type LucideIcon,
} from 'lucide-react';

export interface Course {
  id: string;
  title: string;
  provider: string;
  category: string;
  icon: LucideIcon;
  /** Simple Icons slug for a real brand/language logo — omitted when no fitting logo exists. */
  logo?: string;
  gradient: string;
  weeks: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  skills: string[];
  description: string;
}

// Static course catalog — CareerSync doesn't have a backend course/LMS
// service yet, so this ships as curated content shown to every student.
export const COURSES: Course[] = [
  {
    id: 'full-stack-web-dev',
    title: 'Full Stack Web Development',
    provider: 'CareerSync Learning',
    category: 'Web Development',
    icon: Code2,
    logo: 'react',
    gradient: 'from-blue-600 to-indigo-600',
    weeks: 8,
    level: 'Intermediate',
    price: 1999,
    skills: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    description: 'Build and ship a full stack app end to end — frontend, API and database.',
  },
  {
    id: 'data-science-python',
    title: 'Data Science with Python',
    provider: 'CareerSync Learning',
    category: 'Data Science',
    icon: Database,
    logo: 'python',
    gradient: 'from-emerald-600 to-teal-600',
    weeks: 10,
    level: 'Intermediate',
    price: 2499,
    skills: ['Python', 'Pandas', 'NumPy', 'SQL'],
    description: 'Analyze real datasets and build your first predictive models.',
  },
  {
    id: 'digital-marketing-fundamentals',
    title: 'Digital Marketing Fundamentals',
    provider: 'CareerSync Learning',
    category: 'Marketing',
    icon: Megaphone,
    logo: 'googleanalytics',
    gradient: 'from-rose-600 to-pink-600',
    weeks: 6,
    level: 'Beginner',
    price: 0,
    skills: ['SEO', 'Content', 'Social Media'],
    description: 'The core channels and metrics behind every marketing campaign.',
  },
  {
    id: 'ui-ux-design-essentials',
    title: 'UI/UX Design Essentials',
    provider: 'CareerSync Learning',
    category: 'Design',
    icon: PenTool,
    logo: 'figma',
    gradient: 'from-violet-600 to-purple-600',
    weeks: 5,
    level: 'Beginner',
    price: 1499,
    skills: ['Figma', 'Wireframing', 'Prototyping'],
    description: 'Design portfolio-ready interfaces with a real product process.',
  },
  {
    id: 'python-for-beginners',
    title: 'Python Programming for Beginners',
    provider: 'CareerSync Learning',
    category: 'Programming',
    icon: Terminal,
    logo: 'python',
    gradient: 'from-sky-600 to-cyan-600',
    weeks: 4,
    level: 'Beginner',
    price: 0,
    skills: ['Python', 'Problem Solving'],
    description: 'Your first programming language, taught with practical projects.',
  },
  {
    id: 'cloud-computing-aws',
    title: 'Cloud Computing with AWS',
    provider: 'CareerSync Learning',
    category: 'Cloud & DevOps',
    icon: Cloud,
    gradient: 'from-orange-500 to-amber-600',
    weeks: 6,
    level: 'Advanced',
    price: 2999,
    skills: ['AWS', 'Docker', 'CI/CD'],
    description: 'Deploy and scale production workloads on AWS with confidence.',
  },
  {
    id: 'ai-ml-foundations',
    title: 'Artificial Intelligence & Machine Learning',
    provider: 'CareerSync Learning',
    category: 'AI & ML',
    icon: BrainCircuit,
    logo: 'tensorflow',
    gradient: 'from-fuchsia-600 to-pink-600',
    weeks: 8,
    level: 'Advanced',
    price: 3499,
    skills: ['Python', 'Machine Learning', 'TensorFlow'],
    description: 'From core ML concepts to training your first neural network.',
  },
  {
    id: 'communication-soft-skills',
    title: 'Effective Communication & Soft Skills',
    provider: 'CareerSync Learning',
    category: 'Soft Skills',
    icon: MessagesSquare,
    gradient: 'from-lime-600 to-green-600',
    weeks: 3,
    level: 'Beginner',
    price: 0,
    skills: ['Communication', 'Teamwork'],
    description: 'Interview, present and collaborate with more confidence.',
  },
];
