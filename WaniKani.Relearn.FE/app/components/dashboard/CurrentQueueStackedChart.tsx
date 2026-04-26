import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
              cursor={{ fill: '#334155', opacity: 0.4 }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="radicals" stackId="a" fill="var(--color-wk-radical)" name="Radicals" />
            <Bar dataKey="kanji" stackId="a" fill="var(--color-wk-kanji)" name="Kanji" />
            <Bar dataKey="vocabulary" stackId="a" fill="var(--color-wk-vocabulary)" name="Vocabulary" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
