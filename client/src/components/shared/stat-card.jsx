import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
export function StatCard({ label, value, icon: Icon, hint, accent = 'text-primary', className, }) {
    return (<Card className={cn('overflow-hidden', className)}>
      <CardContent className="flex items-center gap-4 p-5">
        {Icon && (<div className={cn('rounded-lg bg-muted p-3', accent)}>
            <Icon className="h-5 w-5"/>
          </div>)}
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="truncate text-2xl font-bold">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>);
}
