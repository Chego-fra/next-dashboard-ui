"use client";
import { useState, useEffect } from 'react';
import AttendanceChart from "./AttendanceChart";
import Image from 'next/image';

const AttendanceChartContainer = () => {
    // Default attendance data
    const defaultData = [
        { name: "2025-01-01", present: 0, absent: 1 },
        { name: "2025-01-02", present: 1, absent: 0 },
        { name: "2025-01-03", present: 0, absent: 1 },
        { name: "2025-01-04", present: 1, absent: 0 }
    ];

    const [attendanceData, setAttendanceData] = useState(defaultData);

    // Fetch the attendance data from the backend
    useEffect(() => {
        console.log('Component is rendering'); // Log component render
        const fetchAttendanceData = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/getChartAttendanceData'); // Backend API URL
                const data = await response.json();
                console.log('Fetched attendance data:', data); // Log the fetched data
                setAttendanceData(data.data || defaultData); // Use backend data or fallback to default
            } catch (error) {
                console.error('Error fetching attendance data:', error);
                // Fallback to default data if fetch fails
                setAttendanceData(defaultData);
            }
        };

        fetchAttendanceData();
    }, []);

    return (
        <div className='bg-white rounded-lg p-4 h-full'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Attendance</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20}/>
            </div>
            {attendanceData.length > 0 ? (
                <AttendanceChart data={attendanceData} />
            ) : (
                <p>Loading data...</p> // Display loading message until data is fetched
            )}
        </div>
    );
};

export default AttendanceChartContainer;
