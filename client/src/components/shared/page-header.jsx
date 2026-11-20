import { cn } from '@/lib/utils';
/**
 * Every portal page's header: a gradient hero card. The action slot force-
 * styles any button/link inside it to a white pill — callers can keep using
 * plain `<Button>` (solid primary by default) without it disappearing against
 * the gradient; no per-page variant tweaking needed.
 */
export function PageHeader({ title, description, eyebrow, icon: Icon, badge, stats, action, className, }) {
    // Pages that are just a title + description (no stats/action row below)
    // get tighter padding so the card doesn't look like an oversized empty box.
    const compact = !action && !stats?.length;
    return (<div className={cn('relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-indigo-950 text-primary-foreground shadow-lg', compact ? 'p-4 sm:p-5' : 'p-4 sm:p-6', className)}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.15]" style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '18px 18px',
        }}/>
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (<p className="text-[11px] font-semibold uppercase tracking-wider text-primary-foreground/70">
              {eyebrow}
            </p>)}
          <h1 className={cn('text-xl font-bold sm:text-2xl', eyebrow && 'mt-0.5')}>{title}</h1>
          {description && <p className="mt-1 text-sm text-primary-foreground/80">{description}</p>}
        </div>
        {Icon && (<div className="relative shrink-0 rounded-full bg-white/15 p-2.5">
            <Icon className="h-4 w-4"/>
            {Boolean(badge) && (<span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1 text-xs font-bold text-emerald-950">
                {badge}
              </span>)}
          </div>)}
      </div>

      {(Boolean(stats?.length) || action) && (<div className="relative mt-4 flex flex-wrap items-center gap-2">
          {stats?.map((s) => (<div key={s.label} className="flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1.5">
              <span className="text-sm font-bold leading-none">{s.value}</span>
              <span className="text-xs text-primary-foreground/80">{s.label}</span>
            </div>))}
          {action && (<div className={cn('flex shrink-0 flex-wrap items-center gap-2', Boolean(stats?.length) && 'ml-auto', 
                // Force any button/link passed in to a white pill so it reads
                // against the gradient, whatever variant the caller used.
                '[&_a]:!border-transparent [&_a]:!bg-white [&_a]:!text-primary [&_a]:!shadow-sm [&_a]:hover:!bg-white/90', '[&_button]:!border-transparent [&_button]:!bg-white [&_button]:!text-primary [&_button]:!shadow-sm [&_button]:hover:!bg-white/90')}>
              {action}
            </div>)}
        </div>)}
    </div>);
}
