import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField"; // Assuming you have this component
import { useState } from "react";

// Validation schema for class creation
const schema = z.object({
  className: z.string().min(1, { message: 'Class Name is required' }),
  capacity: z
    .string() // First, expect the capacity as a string
    .min(1, { message: 'Capacity must be at least 1' })
    .transform((val) => parseInt(val, 10)) // Convert it to a number
    .refine((val) => !isNaN(val), { message: 'Capacity must be a valid number' }), // Ensure the value is a valid number
  teacherName: z.string().min(1, { message: 'Teacher Name is required' }),
  level: z.string().min(1, { message: 'Grade level is required' }),
});

type Inputs = z.infer<typeof schema>;

const ClassForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const [alert, setAlert] = useState<{ message: string, type: "success" | "error" } | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch("http://localhost:4000/api/addClass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      if (response.status === 201) {
        setAlert({ message: "Class created successfully!", type: "success" });
      } else {
        setAlert({ message: "Error: " + result.message, type: "error" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAlert({ message: "Error posting to the server: " + error.message, type: "error" });
      } else {
        setAlert({ message: "An unknown error occurred.", type: "error" });
      }
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Class" : "Update the Class"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class Name"
          name="className"
          defaultValue={data?.className}
          register={register}
          error={errors?.className}
        />
        <InputField
          label="Capacity"
          name="capacity"
          type="number" // Keeps the input type as number
          defaultValue={data?.capacity}
          register={register}
          error={errors?.capacity}
        />
      </div>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Teacher Name"
          name="teacherName"
          defaultValue={data?.teacherName}
          register={register}
          error={errors?.teacherName}
        />
        <InputField
          label="Grade Level"
          name="level"
          defaultValue={data?.level}
          register={register}
          error={errors?.level}
        />
      </div>

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
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

export default ClassForm;
