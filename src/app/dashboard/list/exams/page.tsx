"use client";
import React, { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data"; // Assuming role is defined elsewhere
import Image from "next/image";

type Exam = {
  id: number;
  examTitle: string;
  lessonName: string;
  score: string;
  startTime: string;
  endTime: string;
};

const columns = [
  { header: "Exam Title", accessor: "examTitle" },
  { header: "Lesson", accessor: "lessonName" },
  { header: "Score", accessor: "score", className: "hidden md:table-cell" },
  { header: "Start Time", accessor: "startTime", className: "hidden md:table-cell" },
  { header: "End Time", accessor: "endTime", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const ExamsListPage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/getAllExams");
        const data = await response.json();

        // Format the fetched data to match your table structure
        const formattedData = data.map((exam: any) => ({
          id: exam.examId,
          examTitle: exam.examTitle,
          lessonName: exam.Lesson?.lessonName || "N/A", // Ensure lesson name is available
          score: exam.Results?.[0]?.score || "N/A", // Assuming exam can have multiple results
          startTime: exam.startTime,
          endTime: exam.endTime,
        }));

        setExams(formattedData);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const renderRow = (item: Exam) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.examTitle}</td>
      <td>{item.lessonName}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell">{item.startTime}</td>
      <td className="hidden md:table-cell">{item.endTime}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <>
              <FormModal table="exam" type="update" data={item} />
              <FormModal table="exam" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="exam" type="create" />}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4">
        <Table columns={columns} data={exams} renderRow={renderRow} />
      </div>

      {/* PAGINATION */}
      <div className="mt-4">
        <Pagination />
      </div>
    </div>
  );
};

export default ExamsListPage;
