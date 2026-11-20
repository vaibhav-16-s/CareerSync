import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from './empty-state';
export function DataTable({ columns, data, loading, rowKey, onRowClick, emptyTitle = 'No records', emptyDescription, skeletonRows = 6, }) {
    if (loading) {
        return (<div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (<TableHead key={c.key} className={c.className}>
                  {c.header}
                </TableHead>))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: skeletonRows }).map((_, i) => (<TableRow key={i}>
                {columns.map((c) => (<TableCell key={c.key}>
                    <Skeleton className="h-4 w-full max-w-[160px]"/>
                  </TableCell>))}
              </TableRow>))}
          </TableBody>
        </Table>
      </div>);
    }
    if (!data.length) {
        return <EmptyState title={emptyTitle} description={emptyDescription}/>;
    }
    return (<div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (<TableHead key={c.key} className={c.className}>
                {c.header}
              </TableHead>))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (<TableRow key={rowKey(row)} onClick={() => onRowClick?.(row)} className={onRowClick ? 'cursor-pointer' : undefined}>
              {columns.map((c) => (<TableCell key={c.key} className={c.className}>
                  {c.render(row)}
                </TableCell>))}
            </TableRow>))}
        </TableBody>
      </Table>
    </div>);
}
