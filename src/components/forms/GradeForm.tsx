import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";

// Validation schema for grade creation
const schema = z.object({
  level: z
    .string()
    .min(1, { message: "Level is required" })
    .transform((val) => parseInt(val, 10)) // Convert string to number
    .refine((val) => !isNaN(val), { message: "Level must be a number" }) // Ensure the value is a number
});

// Type inference from schema
type Inputs = z.infer<typeof schema>;

const GradeForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const [alert, setAlert] = useState<{ message: string, type: "success" | "error" } | null>(null);

  // Submit handler for creating or updating the grade
  const onSubmit = handleSubmit(async (data) => {
    console.log("Form data:", data); // Check if the data is being logged
    try {
      const response = await fetch("http://localhost:4000/api/addGrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.status === 201) {
        setAlert({ message: "Grade created successfully!", type: "success" });
      } else {
        setAlert({ message: "Error: " + result.message, type: "error" });
      }
    } catch (error) {
      if (error instanceof Error) {
        setAlert({ message: "Error posting to the server: " + error.message, type: "error" });
        console.error("Error posting to the server:", error.message);
      } else {
        setAlert({ message: "An unknown error occurred.", type: "error" });
        console.error("An unknown error occurred:", error);
      }
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Grade" : "Update the Grade"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
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

export default GradeForm;
