import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  data: Array<{ timeLabel: string; radicals: number; kanji: number; vocabulary: number }>;
}

export function UpcomingReviewsChart({ data }: Props) {
  return (
    <div className="chart-card">
      <h3 className="text-slate-800 dark:text-slate-200 font-semibold mb-4 text-sm uppercase tracking-wider">Upcoming Reviews</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="timeLabel" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
              cursor={{ fill: '#334155', opacity: 0.4 }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="radicals" stackId="a" fill="var(--color-wk-radical)" name="Radicals" />
            <Bar dataKey="kanji" stackId="a" fill="var(--color-wk-kanji)" name="Kanji" />
            <Bar dataKey="vocabulary" stackId="a" fill="var(--color-wk-vocabulary)" name="Vocabulary" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
