"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";
import Image from "next/image";

// Validation schema for lesson creation
const schema = z.object({
  lessonName: z.string().min(1, { message: 'Lesson name is required' }),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], { message: "Day is required" }),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endTime: z.string().min(1, { message: 'End time is required' }),
  subjectName: z.string().min(1, { message: 'Subject is required' }),
  className: z.string().min(1, { message: 'Class name is required' }),
  teacherName: z.string().min(1, { message: 'Teacher name is required' }),
});

type Inputs = z.infer<typeof schema>;

const LessonForm = ({ type, data }: { type: "create" | "update"; data?: Inputs }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const response = await fetch(
        type === "create" ? "http://localhost:4000/api/addLesson" : "http://localhost:4000/api/updateLesson",
        {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setAlert({ message: "Lesson saved successfully!", type: "success" });
      } else {
        setAlert({ message: "Error: " + result.message, type: "error" });
      }
    } catch (error: unknown) {
      // Assert that error is an instance of Error
      if (error instanceof Error) {
        setAlert({ message: "Error: " + error.message, type: "error" });
      } else {
        setAlert({ message: "An unknown error occurred", type: "error" });
      }
    }
    
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create New Lesson" : "Update Lesson"}</h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Lesson Name"
          name="lessonName"
          defaultValue={data?.lessonName}
          register={register}
          error={errors?.lessonName}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-400">Day</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("day")} defaultValue={data?.day}>
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
          </select>
          {errors.day?.message && <p className="text-xs text-red-400">{errors.day.message}</p>}
        </div>
        <InputField
          label="Start Time"
          name="startTime"
          type="time"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime}
        />
        <InputField
          label="End Time"
          name="endTime"
          type="time"
          defaultValue={data?.endTime}
          register={register}
          error={errors?.endTime}
        />
      </div>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject Name"
          name="subjectName"
          defaultValue={data?.subjectName}
          register={register}
          error={errors?.subjectName}
        />
        <InputField
          label="Class Name"
          name="className"
          defaultValue={data?.className}
          register={register}
          error={errors?.className}
        />
        <InputField
          label="Teacher Name"
          name="teacherName"
          defaultValue={data?.teacherName}
          register={register}
          error={errors?.teacherName}
        />
      </div>

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md mt-4">
        {type === "create" ? "Create Lesson" : "Update Lesson"}
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

export default LessonForm;
