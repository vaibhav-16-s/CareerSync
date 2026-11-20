import * as React from 'react';
import { Label } from './label';
import { cn } from '@/lib/utils';
// Lightweight RHF-friendly field wrapper: label + control + error/hint text.
export function Field({ label, htmlFor, error, hint, required, className, children, }) {
    return (<div className={cn('space-y-1.5', className)}>
      {label && (<Label htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>)}
      {children}
      {error ? (<p className="text-xs text-destructive">{error}</p>) : hint ? (<p className="text-xs text-muted-foreground">{hint}</p>) : null}
    </div>);
}
