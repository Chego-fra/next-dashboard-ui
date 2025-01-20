"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";

// Validation schema for result creation
const schema = z.object({
  score: z.string().transform((val) => Number(val)).refine((val) => !isNaN(val), {
    message: "Score must be a valid number!",
  }),
  examTitle: z.string().optional(),
  assignmentTitle: z.string().optional(),
  studentName: z.string().min(1, { message: "Student name is required!" }),
});

type Inputs = z.infer<typeof schema>;

const ResultForm = ({ type, data }: { type: "create" | "update"; data?: Inputs }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const response = await fetch(
        type === "create" ? "http://localhost:4000/api/addResult" : "http://localhost:4000/api/updateStudent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setAlert({ message: "Result added successfully!", type: "success" });
      } else {
        setAlert({ message: "Error: " + result.message, type: "error" });
      }
    } catch (error) {
      setAlert({
        message: error instanceof Error ? `Error: ${error.message}` : "Unknown error occurred.",
        type: "error",
      });
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Add New Result" : "Update Result"}</h1>

      {/* Form Fields */}
      <InputField
        label="Score"
        name="score"
        type="number"
        register={register}
        error={errors?.score}
      />

      <InputField
        label="Exam Title"
        name="examTitle"
        register={register}
        error={errors?.examTitle}
      />

      <InputField
        label="Assignment Title"
        name="assignmentTitle"
        register={register}
        error={errors?.assignmentTitle}
      />

      <InputField
        label="Student Name"
        name="studentName"
        register={register}
        error={errors?.studentName}
      />

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create Result" : "Update Result"}
      </button>

      {alert && (
        <div
          className={`mt-4 p-2 text-center rounded-md ${alert.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {alert.message}
        </div>
      )}
    </form>
  );
};

export default ResultForm;
