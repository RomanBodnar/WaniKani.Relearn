import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: Array<{ stageGroup: string; [key: string]: string | number }>;
  dataKey: string;
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
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="stageGroup" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
              cursor={{ fill: '#334155', opacity: 0.4 }}
            />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
