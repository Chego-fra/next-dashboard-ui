"use client";

import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import FormModal from "@/components/FormModal";
import { role } from "@/lib/data"; // Assuming role is defined elsewhere

type Attendance = {
  attendanceId: number;
  date: string;
  present: boolean;
  studentName: string;
  lessonName: string;
};

const columns = [
  { header: "Attendance ID", accessor: "attendanceId" },
  { header: "Date", accessor: "date", className: "hidden md:table-cell" },
  { header: "Present", accessor: "present", className: "hidden md:table-cell" },
  { header: "Student Name", accessor: "studentName", className: "hidden md:table-cell" },
  { header: "Lesson Name", accessor: "lessonName", className: "hidden md:table-cell" },
];

const AttendanceListPage = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/getAllAttendance");
        const data = await response.json();

        const formattedData = data.map((attendance: any) => ({
          attendanceId: attendance.attendanceId,
          date: new Date(attendance.date).toLocaleDateString(),
          present: attendance.present ? "Yes" : "No",
          studentName: attendance.Student?.studentName || "N/A",
          lessonName: attendance.Lesson?.lessonName || "N/A",
        }));

        setAttendances(formattedData);
      } catch (error) {
        console.error("Failed to fetch attendances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, []);

  const renderRow = (item: Attendance) => (
    <tr key={item.attendanceId} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="p-4">{item.attendanceId}</td>
      <td className="hidden md:table-cell">{item.date}</td>
      <td className="hidden md:table-cell">{item.present}</td>
      <td className="hidden md:table-cell">{item.studentName}</td>
      <td className="hidden md:table-cell">{item.lessonName}</td>
    </tr>
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Attendances</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="attendance" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={attendances} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default AttendanceListPage;