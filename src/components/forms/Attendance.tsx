"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";

// Validation schema for attendance form
const schema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  present: z.boolean({ required_error: "Presence status is required" }),
  studentName: z.string().min(1, { message: "Student name is required" }),
  lessonName: z.string().min(1, { message: "Lesson name is required" }),
});

type Inputs = z.infer<typeof schema>;

const AttendanceForm = ({ type, data }: { type: "create" | "update"; data?: Inputs }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const response = await fetch(
        type === "create"
          ? "http://localhost:4000/api/addAttendance"
          : "http://localhost:4000/api/updateAssignment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setAlert({ message: "Attendance added successfully!", type: "success" });
      } else {
        setAlert({ message: "Error: " + result.message, type: "error" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAlert({ message: "Error: " + error.message, type: "error" });
      } else {
        setAlert({ message: "An unknown error occurred", type: "error" });
      }
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Add Attendance" : "Update Attendance"}</h1>

      <InputField
        label="Date"
        name="date"
        type="date"
        defaultValue={data?.date}
        register={register}
        error={errors?.date}
      />

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-400">Presence</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("present", {
            setValueAs: (value) => value === "true",
          })}
        >
          <option value="true">Present</option>
          <option value="false">Absent</option>
        </select>
        {errors.present?.message && <p className="text-xs text-red-400">{errors.present.message}</p>}
      </div>

      <InputField
        label="Student Name"
        name="studentName"
        defaultValue={data?.studentName}
        register={register}
        error={errors?.studentName}
      />

      <InputField
        label="Lesson Name"
        name="lessonName"
        defaultValue={data?.lessonName}
        register={register}
        error={errors?.lessonName}
      />

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md mt-4">
        {type === "create" ? "Add Attendance" : "Update Attendance"}
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

export default AttendanceForm;
