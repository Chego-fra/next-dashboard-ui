import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";

// Validation schema for subject creation
const schema = z.object({
  subjectName: z
    .string()
    .min(1, { message: 'Subject Name is required' }),
  teacherName: z
    .string()
    .min(1, { message: 'Teacher Name is required' }),
});

// Type inference from schema
type Inputs = z.infer<typeof schema>;

const SubjectForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const [alert, setAlert] = useState<{ message: string, type: "success" | "error" } | null>(null);

  // Submit handler for creating or updating the subject
  const onSubmit = handleSubmit(async (data) => {
    console.log("Form data:", data); // Check if the data is being logged
    try {
      const response = await fetch("http://localhost:4000/api/addSubject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    
      const result = await response.json();
      if (response.status === 201) {
        setAlert({ message: "Subject created successfully!", type: "success" });
      } else {
        setAlert({ message: "Error: " + result.message, type: "error" });
      }
    } catch (error) {
      if (error instanceof Error) {
        // Typecasting error to the Error type
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
        {type === "create" ? "Create a New Subject" : "Update the Subject"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject Name"
          name="subjectName"
          defaultValue={data?.subjectName}
          register={register}
          error={errors?.subjectName}
        />
        <InputField
          label="Teacher Name"
          name="teacherName"
          defaultValue={data?.teacherName}
          register={register}
          error={errors?.teacherName}
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

export default SubjectForm;
