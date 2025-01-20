"use client";
import React, { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data"; // Assuming role is defined elsewhere
import Image from "next/image";

type Subject = {
  id: number;
  subjectName: string;
  teachers: string;
  lessons: string; // A formatted string containing lesson details
};

const columns = [
  { header: "Subject Name", accessor: "subjectName" },
  { header: "Teachers", accessor: "teachers", className: "hidden md:table-cell" },
  { header: "Lessons", accessor: "lessons", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const SubjectListPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/getAllSubjects");
        const data = await response.json();

        // Format data for the table
        const formattedData = data.map((subject: any) => ({
          id: subject.subjectId,
          subjectName: subject.subjectName,
          teachers: subject.Teacher?.teacherName || "N/A", // Assuming 'Teacher' contains teacher's name
          lessons: subject.Lessons?.length
            ? subject.Lessons.map(
                (lesson: any) => `${lesson.lessonName} (${lesson.day})`
              ).join(", ")
            : "No lessons assigned", // Format lessons as a string
        }));

        setSubjects(formattedData);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const renderRow = (item: Subject) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.subjectName}</td>
      <td className="hidden md:table-cell">{item.teachers}</td>
      <td className="hidden lg:table-cell">{item.lessons}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="subject" type="update" data={item} />
              <FormModal table="subject" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="subject" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={subjects} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default SubjectListPage;
