import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";

// Validation schema for announcement creation
const schema = z.object({
  announcementTitle: z.string().min(1, { message: "Announcement title is required" }),
  description: z.string().optional(),
  date: z.string().min(1, { message: "Date is required" }),
  className: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const AnnouncementForm = ({
  type,
  data,
  onSubmit,
}: {
  type: "create" | "update" | "delete";
  data?: Inputs;
  onSubmit: (formData: Inputs) => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleFormSubmit = async (formData: Inputs) => {
    try {
      await onSubmit(formData);
      setAlert({ message: "Action successful!", type: "success" });
    } catch (error: any) {
      setAlert({ message: `Error: ${error.message}`, type: "error" });
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(handleFormSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Announcement" : type === "update" ? "Update Announcement" : "Delete Announcement"}
      </h1>

      <div className="flex flex-wrap gap-4">
        <InputField label="Title" name="announcementTitle" register={register} error={errors.announcementTitle} />
        <InputField label="Description" name="description" register={register} error={errors.description} />
        <InputField label="Date" name="date" type="date" register={register} error={errors.date} />
        <InputField label="Class Name (Optional)" name="className" register={register} error={errors.className} />
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
        {type.charAt(0).toUpperCase() + type.slice(1)} Announcement
      </button>

      {alert && (
        <div
          className={`mt-4 p-2 text-center ${alert.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {alert.message}
        </div>
      )}
    </form>
  );
};

export default AnnouncementForm;
