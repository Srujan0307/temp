
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'Team A', total: 4500 },
  { name: 'Team B', total: 3000 },
  { name: 'Team C', total: 2000 },
  { name: 'Team D', total: 2780 },
  { name: 'Team E', total: 1890 },
  { name: 'Team F', total: 2390 },
  { name: 'Team G', total: 3490 },
];

export function WorkloadChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
