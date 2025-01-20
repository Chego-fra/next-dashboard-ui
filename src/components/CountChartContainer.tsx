"use client";
import { useEffect, useState } from 'react';
import CountChart from './CountChart';
import Image from 'next/image';

// Define the structure of the API response
interface StudentCount {
  sex: 'MALE' | 'FEMALE';
  count: number;
}

const CountChartContainer = () => {
  const [data, setData] = useState({ boys: 0, girls: 0 });

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/getAllStudentsCount');
        if (!response.ok) throw new Error('Failed to fetch data');
  
        const result: StudentCount[] = await response.json();
        console.log('Fetched data:', result); // Debug log
  
        const boysCount = result.find((item) => item.sex === 'MALE')?.count || 0;
        const girlsCount = result.find((item) => item.sex === 'FEMALE')?.count || 0;
  
        // Log the counts for verification
        console.log('Boys:', boysCount, 'Girls:', girlsCount); // Debug log
        setData({ boys: boysCount, girls: girlsCount });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* CHART */}
      <CountChart boys={data.boys} girls={data.girls} />

      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{data.boys}</h1>
          <h2 className="text-xs text-gray-300">
            Boys ({((data.boys / (data.boys + data.girls)) * 100 || 0).toFixed(1)}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{data.girls}</h1>
          <h2 className="text-xs text-gray-300">
            Girls ({((data.girls / (data.boys + data.girls)) * 100 || 0).toFixed(1)}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChartContainer;
