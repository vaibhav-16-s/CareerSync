'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Field } from '@/components/ui/form-field';
import { Spinner } from '@/components/ui/loader';
import { useApplyToInternship } from '@/hooks/use-internships';
import { applySchema, type ApplyValues } from '@/lib/validations';

interface ApplyDialogProps {
  internshipId: string;
  internshipTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplyDialog({
  internshipId,
  internshipTitle,
  open,
  onOpenChange,
}: ApplyDialogProps) {
  const apply = useApplyToInternship();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplyValues>({
    resolver: zodResolver(applySchema),
    defaultValues: { coverLetter: '' },
  });

  const onSubmit = (values: ApplyValues) => {
    apply.mutate(
      { id: internshipId, coverLetter: values.coverLetter || undefined },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply to {internshipTitle}</DialogTitle>
          <DialogDescription>
            A snapshot of your current profile and resume is sent with your application.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field
            label="Cover letter (optional)"
            htmlFor="coverLetter"
            error={errors.coverLetter?.message}
            hint="Briefly tell the company why you're a great fit."
          >
            <Textarea
              id="coverLetter"
              rows={6}
              placeholder="I'm excited to apply because…"
              {...register('coverLetter')}
            />
          </Field>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={apply.isPending}>
              {apply.isPending && <Spinner className="mr-2" />}
              Submit application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
