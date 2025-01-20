"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";

// Validation schema for creating assignments
const schema = z.object({
  assignmentTitle: z.string().min(1, { message: "Assignment title is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  dueDate: z.string().min(1, { message: "Due date is required" }),
  lessonName: z.string().min(1, { message: "Lesson name is required" }),
});

type Inputs = z.infer<typeof schema>;

const AssignmentForm = ({ type, data }: { type: "create" | "update"; data?: Inputs }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const response = await fetch(type === "create" ? "http://localhost:4000/addAssignment" : "http://localhost:4000/api/updateAssignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setAlert({ message: "Assignment added successfully!", type: "success" });
      } else {
        setAlert({ message: `Error: ${result.message}`, type: "error" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAlert({ message: `Error: ${error.message}`, type: "error" });
      } else {
        setAlert({ message: "An unknown error occurred", type: "error" });
      }
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create New Assignment" : "Update Assignment"}</h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Assignment Title"
          name="assignmentTitle"
          defaultValue={data?.assignmentTitle}
          register={register}
          error={errors?.assignmentTitle}
        />
        <InputField
          label="Start Date"
          name="startDate"
          type="date"
          defaultValue={data?.startDate}
          register={register}
          error={errors?.startDate}
        />
        <InputField
          label="Due Date"
          name="dueDate"
          type="date"
          defaultValue={data?.dueDate}
          register={register}
          error={errors?.dueDate}
        />
      </div>

      <InputField
        label="Lesson Name"
        name="lessonName"
        defaultValue={data?.lessonName}
        register={register}
        error={errors?.lessonName}
      />

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md mt-4">
        {type === "create" ? "Create Assignment" : "Update Assignment"}
      </button>

      {alert && (
        <div
          className={`mt-4 p-2 text-center rounded-md ${
            alert.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {alert.message}
        </div>
      )}
    </form>
  );
};

export default AssignmentForm;
