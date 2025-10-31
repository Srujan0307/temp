
'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const data = [
  { name: 'Jan', sla: 98.5 },
  { name: 'Feb', sla: 97.2 },
  { name: 'Mar', sla: 99.1 },
  { name: 'Apr', sla: 98.0 },
  { name: 'May', sla: 98.8 },
  { name: 'Jun', sla: 99.5 },
];

export function SlaChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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
          domain={[95, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="sla"
          stroke="#adfa1d"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
