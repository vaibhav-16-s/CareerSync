import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';
export function EmptyState({ title, description, icon: Icon = Inbox, action, className, }) {
    return (<div className={cn('flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 px-6 py-16 text-center', className)}>
      <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
        <Icon className="h-7 w-7"/>
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && (<p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>)}
      {action && <div className="mt-5">{action}</div>}
    </div>);
}
