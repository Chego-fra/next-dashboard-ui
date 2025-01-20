"use client";

import React, { useEffect, useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data"; // Assuming role is defined elsewhere
import Image from "next/image";

type Assignment = {
  assignmentId: number;
  assignmentTitle: string;
  startDate: string;
  dueDate: string;
  lesson: string;
};

const columns = [
  { header: "Assignment ID", accessor: "assignmentId" },
  { header: "Assignment Title", accessor: "assignmentTitle" },
  { header: "Start Date", accessor: "startDate", className: "hidden md:table-cell" },
  { header: "Due Date", accessor: "dueDate", className: "hidden md:table-cell" },
  { header: "Lesson ", accessor: "lesson", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const AssignmentsListPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/getAllAssignments");
        const data = await response.json();

        const formattedData = data.map((assignment: any) => ({
          assignmentId: assignment.assignmentId,
          assignmentTitle: assignment.assignmentTitle,
          startDate: new Date(assignment.startDate).toLocaleDateString(),
          dueDate: new Date(assignment.dueDate).toLocaleDateString(),
          lesson: assignment.Lesson?.lessonName || "N/A",
        }));

        setAssignments(formattedData);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const renderRow = (item: Assignment) => (
    <tr
      key={item.assignmentId}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-4">{item.assignmentId}</td>
      <td>{item.assignmentTitle}</td>
      <td className="hidden md:table-cell">{item.startDate}</td>
      <td className="hidden md:table-cell">{item.dueDate}</td>
      <td className="hidden md:table-cell">{item.lesson}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="assignment" type="update" data={item} />
              <FormModal table="assignment" type="delete" id={item.assignmentId} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="assignment" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={assignments} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default AssignmentsListPage;
