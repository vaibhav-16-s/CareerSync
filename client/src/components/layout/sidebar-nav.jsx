import { useMemo } from 'react';
import { cn, isActivePath } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
export function SidebarNav({ items, onNavigate, }) {
    const pathname = useLocation().pathname;
    const allHrefs = useMemo(() => items.map((i) => i.href), [items]);
    return (<nav className="flex flex-col gap-0.5 px-3 py-4">
      {items.map((item) => {
            const active = isActivePath(pathname, item.href, allHrefs);
            const Icon = item.icon;
            return (<Link key={item.href} to={item.href} data-tour={`nav-${item.href}`} onClick={onNavigate} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors', active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground')}>
            <Icon className="h-5 w-5 shrink-0"/>
            <span className="truncate">{item.label}</span>
          </Link>);
        })}
    </nav>);
}
