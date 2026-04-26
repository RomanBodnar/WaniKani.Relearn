import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import type { ReviewsReadySummary, LessonsReadySummary } from '~/types/dashboard';

interface Props {
  data: ReviewsReadySummary | LessonsReadySummary;
  title: string;
}

export function CurrentQueueStackedChart({ data, title }: Props) {
  // Transform the single object into an array of one item for Recharts
  const chartData = [
    {
      name: 'Now',
      radicals: data.radicals,
      kanji: data.kanji,
      vocabulary: data.vocabulary,
    }
  ];

  return (
    <div className="chart-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-sm uppercase tracking-wider">{title}</h3>
        <span className="bg-cyan-500/20 text-cyan-800 dark:text-cyan-400 px-3 py-1 rounded-full text-xs font-bold border border-cyan-500/30">
          Total: {data.total}
        </span>
      </div>
      <div className="h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-color)" horizontal={false} />
            <XAxis type="number" stroke="var(--chart-axis-color)" tick={{ fill: 'var(--chart-axis-color)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" stroke="var(--chart-axis-color)" tick={{ fill: 'var(--chart-axis-color)', fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: '8px', color: 'var(--chart-tooltip-text)' }}
              itemStyle={{ color: 'var(--chart-tooltip-text)' }}
              cursor={{ fill: 'var(--chart-grid-color)', opacity: 0.4 }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="radicals" stackId="a" fill="var(--color-wk-radical)" name="Radicals">
              <LabelList dataKey="radicals" position="center" fill="#ffffff" fontSize={11} formatter={(val: number) => val > 0 ? val : ''} />
            </Bar>
            <Bar dataKey="kanji" stackId="a" fill="var(--color-wk-kanji)" name="Kanji">
              <LabelList dataKey="kanji" position="center" fill="#ffffff" fontSize={11} formatter={(val: number) => val > 0 ? val : ''} />
            </Bar>
            <Bar dataKey="vocabulary" stackId="a" fill="var(--color-wk-vocabulary)" name="Vocabulary" radius={[0, 4, 4, 0]}>
              <LabelList dataKey="vocabulary" position="center" fill="#ffffff" fontSize={11} formatter={(val: number) => val > 0 ? val : ''} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
