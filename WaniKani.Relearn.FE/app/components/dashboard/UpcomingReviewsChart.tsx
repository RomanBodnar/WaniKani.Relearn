import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import type { UpcomingReviewsSummary } from '~/types/dashboard';

interface Props {
  data: UpcomingReviewsSummary[];
}

export function UpcomingReviewsChart({ data }: Props) {
  return (
    <div className="chart-card">
      <h3 className="text-slate-800 dark:text-slate-200 font-semibold mb-4 text-sm uppercase tracking-wider">Upcoming Reviews</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid-color)" vertical={false} />
            <XAxis dataKey="timeLabel" stroke="var(--chart-axis-color)" tick={{ fill: 'var(--chart-axis-color)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--chart-axis-color)" tick={{ fill: 'var(--chart-axis-color)', fontSize: 12 }} axisLine={false} tickLine={false} />
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
            <Bar dataKey="vocabulary" stackId="a" fill="var(--color-wk-vocabulary)" name="Vocabulary" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="vocabulary" position="center" fill="#ffffff" fontSize={11} formatter={(val: number) => val > 0 ? val : ''} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
