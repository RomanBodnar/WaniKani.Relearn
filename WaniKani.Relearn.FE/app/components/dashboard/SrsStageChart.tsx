import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import type { SrsDistributionItem } from '~/types/dashboard';

interface Props {
  data: SrsDistributionItem[];
  dataKey: 'radicals' | 'kanji' | 'vocabulary';
  color: string;
  title: string;
}

export function SrsStageChart({ data, dataKey, color, title }: Props) {
  return (
    <div className="chart-card">
      <h3 className="text-slate-800 dark:text-slate-200 font-semibold mb-4 text-sm uppercase tracking-wider">{title}</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-color)" vertical={false} />
            <XAxis dataKey="stage" stroke="var(--chart-axis-color)" tick={{ fill: 'var(--chart-axis-color)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--chart-axis-color)" tick={{ fill: 'var(--chart-axis-color)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: '8px', color: 'var(--chart-tooltip-text)' }}
              itemStyle={{ color: 'var(--chart-tooltip-text)' }}
              cursor={{ fill: 'var(--chart-grid-color)', opacity: 0.4 }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]}>
              <LabelList dataKey={dataKey} position="top" fill="var(--chart-axis-color)" fontSize={12} formatter={(val: number) => val > 0 ? val : ''} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
