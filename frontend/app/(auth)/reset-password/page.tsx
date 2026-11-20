'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/form-field';
import { Spinner } from '@/components/ui/loader';
import { useResetPassword } from '@/hooks/use-auth';
import { resetPasswordSchema, type ResetPasswordValues } from '@/lib/validations';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const reset = useResetPassword();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: '', password: '', confirmPassword: '' },
  });

  // Prefill the token from the email link (?token=...).
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) setValue('token', token);
  }, [searchParams, setValue]);

  const onSubmit = (values: ResetPasswordValues) =>
    reset.mutate({ token: values.token, password: values.password });

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-2xl font-bold tracking-tight">Set a new password</h1>
        <p className="text-sm text-muted-foreground">
          Choose a strong password you haven&apos;t used before.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field
          label="Reset token"
          htmlFor="token"
          error={errors.token?.message}
          hint="Pre-filled from your reset link. Paste it here if needed."
          required
        >
          <Input id="token" placeholder="Paste your reset token" {...register('token')} />
        </Field>

        <Field
          label="New password"
          htmlFor="password"
          error={errors.password?.message}
          required
        >
          <div className="relative">
            <Input
              id="password"
              type={show ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-label="Toggle password visibility"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        <Field
          label="Confirm password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
          required
        >
          <Input
            id="confirmPassword"
            type={show ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('confirmPassword')}
          />
        </Field>

        <Button type="submit" className="w-full" disabled={reset.isPending}>
          {reset.isPending && <Spinner className="mr-2" />}
          Reset password
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Spinner className="mx-auto h-6 w-6" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
