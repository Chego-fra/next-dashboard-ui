"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";

const schema = z.object({
  eventTitle: z.string().min(1, { message: "Event title is required" }),
  description: z.string().optional(),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  className: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const EventForm = ({ type, data }: { type: "create" | "update"; data?: Inputs }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const response = await fetch(
        type === "create" ? "http://localhost:4000/api/addEvent" : "http://localhost:4000/api/updateEvent",
        {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setAlert({ message: "Event saved successfully!", type: "success" });
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Create New Event" : "Update Event"}</h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Event Title"
          name="eventTitle"
          defaultValue={data?.eventTitle}
          register={register}
          error={errors?.eventTitle}
        />
        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
      </div>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Start Time"
          name="startTime"
          type="datetime-local"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime}
        />
        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          defaultValue={data?.endTime}
          register={register}
          error={errors?.endTime}
        />
      </div>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class Name"
          name="className"
          defaultValue={data?.className}
          register={register}
          error={errors?.className}
        />
      </div>

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md mt-4">
        {type === "create" ? "Create Event" : "Update Event"}
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

export default EventForm;
