import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, } from 'recharts';
const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7'];
export function SimpleBarChart({ data, height = 280, color = '#6366f1', }) {
    return (<ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false}/>
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false}/>
        <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
        <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} contentStyle={{
            background: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 8,
            fontSize: 12,
        }}/>
        <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={48}/>
      </BarChart>
    </ResponsiveContainer>);
}
export function SimpleLineChart({ data, height = 280, color = '#6366f1', }) {
    return (<ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false}/>
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false}/>
        <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
        <Tooltip contentStyle={{
            background: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 8,
            fontSize: 12,
        }}/>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false}/>
      </LineChart>
    </ResponsiveContainer>);
}
// Each pipeline stage gets its own color so the funnel reads at a glance —
// amber while waiting, indigo once shortlisted, green on a hire, red on a
// rejection. Unrecognized stage names fall back to a rotating palette.
const STAGE_COLORS = {
    pending: '#f59e0b',
    shortlisted: '#6366f1',
    hired: '#22c55e',
    rejected: '#ef4444',
    withdrawn: '#94a3b8',
};
const STAGE_FALLBACK_COLORS = ['#06b6d4', '#a855f7', '#ec4899', '#0ea5e9'];
const colorForStage = (name, i) => STAGE_COLORS[name.toLowerCase()] ?? STAGE_FALLBACK_COLORS[i % STAGE_FALLBACK_COLORS.length];
/**
 * Hiring-pipeline funnel — stages taper top→bottom, each with its own color
 * (see STAGE_COLORS). Stages with no one in them yet are faded so the eye
 * still lands on where applicants actually are.
 * Feed it stages in pipeline order (e.g. Pending → Shortlisted → Hired → Rejected).
 */
export function PipelineFunnel({ data, height, }) {
    // Progressive taper gives the funnel shape regardless of the counts.
    const widths = ['100%', '84%', '68%', '54%', '42%', '32%'];
    return (<div className="flex flex-col" style={height ? { minHeight: height } : undefined}>
      <div className="flex flex-1 flex-col items-center gap-1.5 py-2">
        {data.map((d, i) => {
            const color = colorForStage(d.name, i);
            const empty = d.value === 0;
            return (<div key={d.name} className="flex items-center justify-center rounded-md py-2.5 text-sm font-semibold text-white shadow-sm transition-all" style={{ width: widths[i] ?? '28%', backgroundColor: color, opacity: empty ? 0.4 : 1 }} title={`${d.name}: ${d.value}`}>
              <span className="mr-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1.5 text-xs">
                {d.value}
              </span>
              {d.name}
            </div>);
        })}
      </div>
      {/* Legend — one swatch per stage, matching the bar colors above. */}
      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t pt-3 text-xs text-muted-foreground">
        {data.map((d, i) => (<span key={d.name} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colorForStage(d.name, i) }}/> {d.name}
          </span>))}
      </div>
    </div>);
}
export function SimpleDonutChart({ data, height = 280, }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) {
        return (<div style={{ height }} className="flex items-center justify-center text-sm text-muted-foreground">
        No data yet
      </div>);
    }
    return (<ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
          {data.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]}/>))}
        </Pie>
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }}/>
        <Tooltip contentStyle={{
            background: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 8,
            fontSize: 12,
        }}/>
      </PieChart>
    </ResponsiveContainer>);
}
