import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Image from "next/image"; // For optimized image rendering

// Validation schema for teacher creation
const schema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  teacherName: z.string().min(1, { message: "Teacher Name is required" }),
  surname: z.string().min(1, { message: "Surname is required" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  phone: z.string().optional(),
  address: z.string().min(1, { message: "Address is required" }),
  bloodType: z.string().min(1, { message: "Blood type is required" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  birthday: z.string().min(1, { message: "Birthday is required" }),
  img: z.any().optional(), // For image file
});

// Type inference from schema
type Inputs = z.infer<typeof schema>;

interface TeacherFormProps {
  type: "create" | "update";
  data?: Inputs;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ type, data }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview

  const onSubmit = handleSubmit(async (formData) => {
    const finalData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "img" && value instanceof FileList && value.length > 0) {
        finalData.append(key, value[0]);
        // Preview the image immediately after selection
        const file = value[0];
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl); // Set the preview URL
      } else {
        finalData.append(key, value as string);
      }
    });

    try {
      const response = await fetch(
        type === "create" ? "http://localhost:4000/api/addTeacher" : "http://localhost:4000/api/updateTeacher",
        {
          method: "POST",
          body: finalData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        setAlert({ message: "Teacher saved successfully!", type: "success" });

        // Assuming the backend returns the image filename, construct the image URL
        const imageUrl = `http://localhost:4000/images/${result.filePath}`;
        setImagePreview(imageUrl); // Update the preview with the correct URL
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
    <form className="flex flex-col gap-8" onSubmit={onSubmit} encType="multipart/form-data">
      <h1 className="text-xl font-semibold">{type === "create" ? "Add a New Teacher" : "Update Teacher"}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> {/* Adjusted grid layout */}
        <div className="mb-2">
          <label className="text-xs text-gray-500">Username</label>
          <input {...register("username")} type="text" className="p-2 rounded-md ring-1 ring-gray-300 w-full" />
          {errors.username && <p className="text-xs text-red-400">{errors.username.message}</p>}
        </div>
        <div className="mb-2">
          <label className="text-xs text-gray-500">Teacher Name</label>
          <input {...register("teacherName")} type="text" className="p-2 rounded-md ring-1 ring-gray-300 w-full" />
          {errors.teacherName && <p className="text-xs text-red-400">{errors.teacherName.message}</p>}
        </div>
        <div className="mb-2">
          <label className="text-xs text-gray-500">Surname</label>
          <input {...register("surname")} type="text" className="p-2 rounded-md ring-1 ring-gray-300 w-full" />
          {errors.surname && <p className="text-xs text-red-400">{errors.surname.message}</p>}
        </div>

        <div className="mb-2">
          <label className="text-xs text-gray-500">Email</label>
          <input {...register("email")} type="email" className="p-2 rounded-md ring-1 ring-gray-300 w-full" />
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div className="mb-2">
          <label className="text-xs text-gray-500">Phone</label>
          <input {...register("phone")} type="text" className="p-2 rounded-md ring-1 ring-gray-300 w-full" />
          {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
        </div>
        <div className="mb-2">
          <label className="text-xs text-gray-500">Address</label>
          <input {...register("address")} type="text" className="p-2 rounded-md ring-1 ring-gray-300 w-full" />
          {errors.address && <p className="text-xs text-red-400">{errors.address.message}</p>}
        </div>

        <div className="mb-2">
          <label className="text-xs text-gray-500">Blood Type</label>
          <input {...register("bloodType")} type="text" className="p-2 rounded-md ring-1 ring-gray-300 w-full" />
          {errors.bloodType && <p className="text-xs text-red-400">{errors.bloodType.message}</p>}
        </div>
        <div className="mb-2">
          <label className="text-xs text-gray-500">Sex</label>
          <select {...register("sex")} className="p-2 rounded-md ring-1 ring-gray-300 w-full">
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex && <p className="text-xs text-red-400">{errors.sex.message}</p>}
        </div>
        <div className="mb-2">
          <label className="text-xs text-gray-500">Birthday</label>
          <input {...register("birthday")} type="date" className="p-2 rounded-md ring-1 ring-gray-300 w-full" />
          {errors.birthday && <p className="text-xs text-red-400">{errors.birthday.message}</p>}
        </div>

        <div className="mb-2 flex flex-col">
          <label className="text-xs text-gray-500">Photo</label>
          <input {...register("img")} type="file" accept="image/*" className="p-2 rounded-md ring-1 ring-gray-300 w-full" />
        </div>
      </div>

      {/* Image Preview */}
      {/* {imagePreview && (
        <div className="mt-4 flex justify-center">
          <Image src={imagePreview} alt="Preview" width={128} height={128} className="object-cover rounded-md" />
        </div>
      )} */}

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md mt-4">
        {type === "create" ? "Add Teacher" : "Update Teacher"}
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

export default TeacherForm;
