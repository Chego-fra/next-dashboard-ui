"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";
import Image from "next/image";

// Validation schema for student creation
const schema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters long!' }).max(20),
  studentName: z.string().min(1, { message: 'First name is required' }),
  surname: z.string().min(1, { message: 'Surname is required' }),
  email: z.string().email({ message: "Invalid email address!" }).optional(),
  phone: z.string().optional(),
  address: z.string().min(1, { message: 'Address is required' }),
  bloodType: z.string().min(1, { message: 'Blood type is required' }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  birthday: z.string().min(1, { message: 'Birthday is required' }),
  img: z.any().optional(), // For image file
  parentName: z.string().min(1, { message: 'Parent name is required' }),
  className: z.string().min(1, { message: 'Class name is required' }),
  level: z.string().min(1, { message: 'Grade level is required' }),
});

type Inputs = z.infer<typeof schema>;

const StudentForm = ({ type, data }: { type: "create" | "update"; data?: Inputs }) => {
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
        type === "create" ? "http://localhost:4000/api/addStudent" : "http://localhost:4000/api/updateStudent",
        {
          method: "POST",
          body: finalData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        setAlert({ message: "Student saved successfully!", type: "success" });
        // Assuming the backend returns the image filename, construct the image URL
        const imageUrl = `http://localhost:4000/images/${result.img}`;
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
      <h1 className="text-xl font-semibold">{type === "create" ? "Create New Student" : "Update Student"}</h1>

      {/* Authentication Information */}
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
      </div>

      {/* Personal Information */}
      <span className="text-xs text-gray-400 font-medium">Personal Information</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="studentName"
          defaultValue={data?.studentName}
          register={register}
          error={errors?.studentName}
        />
        <InputField
          label="Surname"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors?.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors?.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors?.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors?.bloodType}
        />
        <InputField
          label="Birthday"
          name="birthday"
          type="date"
          defaultValue={data?.birthday}
          register={register}
          error={errors?.birthday}
        />
      </div>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <InputField
          label="Sex"
          name="sex"
          defaultValue={data?.sex}
          register={register}
          error={errors?.sex}
          type="select"
        />
        <InputField
          label="Parent Name"
          name="parentName"
          defaultValue={data?.parentName}
          register={register}
          error={errors?.parentName}
        />
        <InputField
          label="Class Name"
          name="className"
          defaultValue={data?.className}
          register={register}
          error={errors?.className}
        />
        <InputField
          label="Grade Level"
          name="level"
          defaultValue={data?.level}
          register={register}
          error={errors?.level}
        />
      </div>

      {/* Image Upload */}
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-400 flex items-center gap-2 cursor-pointer" htmlFor="img">
          <Image src="/upload.png" alt="" width={28} height={28} />
          <span>Upload a Photo</span>
        </label>
        <input type="file" id="img" {...register("img")} className="hidden" />
        {errors.img?.message && (
          <p className="text-xs text-red-400">
            {errors.img.message.toString()}
          </p>
        )}
      </div>

      {/* Image Preview */}
      {/* {imagePreview && (
        <div className="mt-4 flex justify-center">
          <Image src={imagePreview} alt="Preview" width={128} height={128} className="object-cover rounded-md" />
        </div>
      )} */}

      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md mt-4">
        {type === "create" ? "Create Student" : "Update Student"}
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

export default StudentForm;
