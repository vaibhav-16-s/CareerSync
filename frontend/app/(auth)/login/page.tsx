'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, GraduationCap, Building2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Field } from '@/components/ui/form-field';
import { Spinner } from '@/components/ui/loader';
import { useLogin } from '@/hooks/use-auth';
import { loginSchema, type LoginValues } from '@/lib/validations';

export default function LoginPage() {
  const login = useLogin();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginValues) => login.mutate(values);

  const DEMO_PASSWORD = 'Password123';
  const quickLogin = (email: string) => {
    setValue('email', email);
    setValue('password', DEMO_PASSWORD);
    login.mutate({ email, password: DEMO_PASSWORD });
  };

  return (
    <Card className="border shadow-lg">
      <CardContent className="space-y-6 p-6 sm:p-8">
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to continue to CareerSync.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Email" htmlFor="email" error={errors.email?.message} required>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
            />
          </Field>

          <Field
            label="Password"
            htmlFor="password"
            error={errors.password?.message}
            required
          >
            <div className="relative">
              <Input
                id="password"
                type={show ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending && <Spinner className="mr-2" />}
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>

        <div className="space-y-2 rounded-lg border bg-muted/40 p-3">
          <p className="text-xs font-medium text-muted-foreground">Quick sign in as a demo account</p>
          <div className="grid grid-cols-3 gap-2">
            <Button type="button" variant="outline" size="sm" className="flex-col h-auto py-2 text-xs" disabled={login.isPending} onClick={() => quickLogin('student@example.com')}>
              <GraduationCap className="mb-1 h-4 w-4" /> Student
            </Button>
            <Button type="button" variant="outline" size="sm" className="flex-col h-auto py-2 text-xs" disabled={login.isPending} onClick={() => quickLogin('company@example.com')}>
              <Building2 className="mb-1 h-4 w-4" /> Company
            </Button>
            <Button type="button" variant="outline" size="sm" className="flex-col h-auto py-2 text-xs" disabled={login.isPending} onClick={() => quickLogin('admin@internbridge.com')}>
              <ShieldCheck className="mb-1 h-4 w-4" /> Admin
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">All demo accounts use password <span className="font-medium">Password123</span>.</p>
        </div>
      </CardContent>
    </Card>
  );
}
