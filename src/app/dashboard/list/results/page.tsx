"use client";
import React, { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data"; // Assuming role is defined elsewhere
import Image from "next/image";

type Result = {
  id: number;
  studentName: string;
  examTitle: string;
  assignmentTitle: string;
  score: number;
};

const columns = [
  { header: "Student Name", accessor: "studentName" },
  { header: "Exam Title", accessor: "examTitle" },
  { header: "Assignment Title", accessor: "assignmentTitle" },
  { header: "Score", accessor: "score" },
  { header: "Actions", accessor: "action" },
];

const ResultsListPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/getAllResults");
        const data = await response.json();

        // Format the data for the table
        const formattedResults = data.map((result: any) => ({
          id: result.resultId,
          studentName: result.Student?.studentName || "Unknown",
          examTitle: result.Exam?.examTitle || "N/A",
          assignmentTitle: result.Assignment?.assignmentTitle || "N/A",
          score: result.score || 0, // Assuming a score is available
        }));

        setResults(formattedResults);
      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const renderRow = (item: Result) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">{item.studentName}</td>
      <td>{item.examTitle}</td>
      <td>{item.assignmentTitle}</td>
      <td>{item.score}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="result" type="update" data={item} />
              <FormModal table="result" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="result" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={results} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default ResultsListPage;
