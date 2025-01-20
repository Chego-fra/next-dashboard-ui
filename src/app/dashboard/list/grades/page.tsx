"use client";
import React, { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data"; // Assuming role is defined elsewhere
import Image from "next/image";

type Grade = {
  id: number;
  level: number;
  students: { studentId: number; studentName: string; email: string }[];
};

const columns = [
  { header: "Grade Level", accessor: "level" },
  { header: "Student Name", accessor: "studentName" },
  { header: "Student Email", accessor: "email" },
  { header: "Actions", accessor: "action" },
];

const GradeListPage = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/getAllGrades");
        const data = await response.json();
        console.log(data); // Log the data for debugging

        const formattedData = data.map((grade: any) => ({
          id: grade.gradeId,
          level: grade.level,
          students: grade.Students?.map((student: any) => ({
            studentId: student.studentId,
            studentName: student.studentName,
            email: student.email,
          })) || [], // If no students, return empty array
        }));

        setGrades(formattedData);
      } catch (error) {
        console.error("Failed to fetch grades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const renderRow = (grade: Grade) => (
    <>
      {grade.students.length > 0 ? (
        grade.students.map((student) => (
          <tr key={student.studentId} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
            <td className="flex items-center gap-4 p-4">{grade.level}</td>
            <td>{student.studentName}</td>
            <td>{student.email}</td>
            <td>
              <div className="flex items-center gap-2">
                {role === "admin" && (
                  <>
                    <FormModal table="grade" type="update" data={student} />
                    <FormModal table="grade" type="delete" id={student.studentId} />
                  </>
                )}
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr key={grade.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
          <td className="flex items-center gap-4 p-4">{grade.level}</td>
          <td colSpan={3} className="text-center text-gray-500">No students yet</td>
        </tr>
      )}
    </>
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Grades</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="grade" type="create" />}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={grades} />
      <Pagination />
    </div>
  );
};

export default GradeListPage;
