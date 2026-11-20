'use client';

import { GraduationCap, X } from 'lucide-react';
import type { TooltipRenderProps } from 'react-joyride';
import { cn } from '@/lib/utils';

export function TourTooltip({
  index,
  size,
  isLastStep,
  step,
  backProps,
  primaryProps,
  skipProps,
  closeProps,
  tooltipProps,
}: TooltipRenderProps) {
  return (
    <div
      {...tooltipProps}
      className="w-[360px] overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-2xl ring-1 ring-black/5"
    >
      <div className="h-1 w-full bg-muted">
        <div
          className="h-full bg-primary transition-[width] duration-300"
          style={{ width: `${((index + 1) / size) * 100}%` }}
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <button
            {...closeProps}
            className="-mr-1 -mt-1 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {step.title && <h3 className="mt-3 text-base font-bold leading-snug">{step.title}</h3>}
        {step.content && (
          <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.content}</div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: size }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === index ? 'w-4 bg-primary' : 'w-1.5 bg-muted'
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            {!isLastStep && (
              <button
                {...skipProps}
                className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Skip
              </button>
            )}
            {index > 0 && (
              <button
                {...backProps}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Back
              </button>
            )}
            <button
              {...primaryProps}
              className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              {isLastStep ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
