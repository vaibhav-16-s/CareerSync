'use client';

import { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, GraduationCap, PlayCircle, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { SearchBar } from '@/components/shared/search-bar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { COURSES, type Course } from '@/constants/courses';
import { useCourseStore, type CourseEnrollment } from '@/store/course.store';
import { cn, formatCurrency } from '@/lib/utils';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
] as const;

type Filter = (typeof FILTERS)[number]['value'];

// Real brand logo (via Simple Icons) when a course has one, falling back to
// the Lucide category icon if there's no fitting logo or the image 404s.
function CourseLogo({ course, className }: { course: Course; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (course.logo && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://cdn.simpleicons.org/${course.logo}/ffffff`}
        alt=""
        className={cn('object-contain', className)}
        onError={() => setFailed(true)}
      />
    );
  }
  return <course.icon className={className} />;
}

export default function CoursesPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const enrollments = useCourseStore((s) => s.enrollments);
  const enroll = useCourseStore((s) => s.enroll);
  const advance = useCourseStore((s) => s.advance);

  const current = useMemo(() => {
    const result: { course: Course; enrollment: CourseEnrollment }[] = [];
    for (const course of COURSES) {
      const enrollment = enrollments[course.id];
      if (enrollment && !enrollment.completed) result.push({ course, enrollment });
    }
    return result;
  }, [enrollments]);

  const completedCount = useMemo(
    () => Object.values(enrollments).filter((e) => e.completed).length,
    [enrollments]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COURSES.filter((c) => {
      if (filter === 'free' && c.price > 0) return false;
      if (filter === 'paid' && c.price === 0) return false;
      if (q && !`${c.title} ${c.category} ${c.skills.join(' ')}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filter, query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Short, project-based courses mapped to what our AI matching looks for."
        eyebrow="Skill building"
        icon={BookOpen}
        stats={[
          { value: current.length, label: 'In progress' },
          { value: completedCount, label: 'Completed' },
          { value: COURSES.length, label: 'Available' },
        ]}
      />

      {current.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Continue learning</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {current.map(({ course, enrollment }) => (
              <Card key={course.id} className="overflow-hidden">
                <div
                  className={cn(
                    'flex h-16 items-center gap-3 bg-gradient-to-br px-4 text-white',
                    course.gradient
                  )}
                >
                  <CourseLogo course={course} className="h-6 w-6 shrink-0" />
                  <p className="line-clamp-1 font-semibold">{course.title}</p>
                </div>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{enrollment.progress}% complete</span>
                    <span>{course.weeks} weeks</span>
                  </div>
                  <Progress value={enrollment.progress} />
                  <Button size="sm" className="w-full" onClick={() => advance(course.id)}>
                    <PlayCircle className="mr-1.5 h-4 w-4" /> Continue
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={query}
          onSearch={setQuery}
          placeholder="Search courses, skills…"
          className="sm:max-w-xs"
        />
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            {FILTERS.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No courses match"
          description="Try a different filter or search term."
          icon={BookOpen}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => {
            const enrollment = enrollments[course.id];
            return (
              <Card
                key={course.id}
                className="group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={cn(
                    'flex h-24 items-center justify-center bg-gradient-to-br text-white',
                    course.gradient
                  )}
                >
                  <CourseLogo course={course} className="h-9 w-9" />
                </div>
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{course.title}</h3>
                    <Badge variant={course.price === 0 ? 'success' : 'secondary'} className="shrink-0">
                      {course.price === 0 ? 'Free' : formatCurrency(course.price)}
                    </Badge>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground">
                      <GraduationCap className="h-2.5 w-2.5" />
                    </span>
                    <span className="truncate">
                      {course.provider} · {course.weeks} weeks · {course.level}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{course.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {course.skills.map((s) => (
                      <Badge key={s} variant="outline" className="font-normal">
                        {s}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-auto pt-4">
                    {enrollment?.completed ? (
                      <Button variant="secondary" className="w-full" disabled>
                        <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-600" /> Completed
                      </Button>
                    ) : enrollment ? (
                      <Button className="w-full" onClick={() => advance(course.id)}>
                        <PlayCircle className="mr-1.5 h-4 w-4" /> Continue ({enrollment.progress}%)
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" onClick={() => enroll(course.id)}>
                        <Sparkles className="mr-1.5 h-4 w-4" />{' '}
                        {course.price === 0 ? 'Enroll for free' : `Enroll · ${formatCurrency(course.price)}`}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
