import { ScrollArea } from '@/components/ui/scroll-area';
import { Brand } from './brand';
import { SidebarNav } from './sidebar-nav';
export function Sidebar({ items, homeHref }) {
    return (<aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-card lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Brand href={homeHref}/>
      </div>
      <ScrollArea className="flex-1">
        <SidebarNav items={items}/>
      </ScrollArea>
    </aside>);
}
