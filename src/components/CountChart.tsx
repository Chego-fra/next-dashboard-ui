"use client"
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import Image from 'next/image';

interface CountChartProps {
  boys: number;
  girls: number;
}

const CountChart = ({ boys, girls }: CountChartProps) => {
  const data = [
    {
      name: 'Total',
      count: boys + girls || 10, // Ensure total is valid
      fill: '#fff',
    },
    {
      name: 'Girls',
      count: girls || 5, // Default to 0 if invalid
      fill: '#FAE27C',
    },
    {
      name: 'Boys',
      count: boys || 5, // Default to 0 if invalid
      fill: '#C3EBFA',
    },
  ];

  console.log('Chart Data:', data); // Debug data

  return (
    <div className="relative w-full h-[75%]">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={32}
          data={data}
        >
          <RadialBar background dataKey="count" />
        </RadialBarChart>
      </ResponsiveContainer>
      <Image
        src="/maleFemale.png"
        alt=""
        width={50}
        height={50}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default CountChart;
