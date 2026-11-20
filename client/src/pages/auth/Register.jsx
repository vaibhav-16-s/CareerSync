import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, GraduationCap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Field } from '@/components/ui/form-field';
import { Spinner } from '@/components/ui/loader';
import { cn } from '@/lib/utils';
import { useRegister } from '@/hooks/use-auth';
import { registerSchema } from '@/lib/validations';
import { UserRole } from '@/types';
import { Link, useSearchParams } from 'react-router-dom';
function RegisterForm() {
    const [searchParams] = useSearchParams();
    const registerMutation = useRegister();
    const [show, setShow] = useState(false);
    const { register, handleSubmit, setValue, watch, formState: { errors }, } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            role: UserRole.STUDENT,
            password: '',
            confirmPassword: '',
        },
    });
    const role = watch('role');
    // Lets links like `/register?role=company` land with the Company option
    // pre-selected, e.g. the "post an internship" CTA aimed at employers.
    useEffect(() => {
        if (searchParams.get('role') === UserRole.COMPANY) {
            setValue('role', UserRole.COMPANY);
        }
    }, [searchParams, setValue]);
    const onSubmit = (values) => {
        const { confirmPassword, ...payload } = values;
        void confirmPassword;
        registerMutation.mutate(payload);
    };
    return (<Card className="border shadow-lg">
      <CardContent className="space-y-4 p-5 sm:p-6">
        <div className="space-y-1 text-center lg:text-left">
          <h1 className="text-xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Join InternBridge in less than a minute.
          </p>
        </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Role selector */}
        <Field label="I am a…" error={errors.role?.message}>
          <div className="grid grid-cols-2 gap-3">
            {[
            { value: UserRole.STUDENT, label: 'Student', icon: GraduationCap },
            { value: UserRole.COMPANY, label: 'Company', icon: Building2 },
        ].map((opt) => (<button key={opt.value} type="button" onClick={() => setValue('role', opt.value, { shouldValidate: true })} className={cn('flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-sm font-medium transition-colors', role === opt.value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-input hover:border-primary/40')}>
                <opt.icon className="h-5 w-5"/>
                {opt.label}
              </button>))}
          </div>
        </Field>

        <Field label={role === UserRole.COMPANY ? 'Company name' : 'Full name'} htmlFor="name" error={errors.name?.message} required>
          <Input id="name" placeholder="Jane Doe" {...register('name')}/>
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email?.message} required>
          <Input id="email" type="email" placeholder="you@example.com" {...register('email')}/>
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password?.message} hint="At least 8 characters, with upper, lower and a number." required>
          <div className="relative">
            <Input id="password" type={show ? 'text' : 'password'} placeholder="••••••••" {...register('password')}/>
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle password visibility">
              {show ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
            </button>
          </div>
        </Field>

        <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message} required>
          <Input id="confirmPassword" type={show ? 'text' : 'password'} placeholder="••••••••" {...register('confirmPassword')}/>
        </Field>

        <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
          {registerMutation.isPending && <Spinner className="mr-2"/>}
          Create account
        </Button>
      </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>);
}
export default function RegisterPage() {
    return (<Suspense fallback={<Spinner className="mx-auto h-6 w-6"/>}>
      <RegisterForm />
    </Suspense>);
}
