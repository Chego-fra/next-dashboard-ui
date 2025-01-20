import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define the schema for validation
const schema = z.object({
  id: z.string().optional(), // Optional for creating a new entry, required for updating
  username: z.string().min(3).max(20),
  parentName: z.string().min(1),
  surname: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
});

// Define types
type ParentData = {
  id: string;
  username: string;
  parentName: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
};

type ParentFormProps = {
  type: "create" | "update" | "delete";
  data: ParentData;
  onSubmit: (formData: ParentData) => void;
  onDelete: () => void;
};

type Inputs = {
  username: string;
  parentName: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
};

// Define the ParentForm component
const ParentForm: React.FC<ParentFormProps> = ({ type, data, onSubmit, onDelete }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data, // Ensure form uses the passed data
  });

  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle form submission
  const handleFormSubmit = handleSubmit(async (formData) => {
    setLoading(true);
    try {
      const finalFormData: ParentData = {
        id: type === "update" ? data.id : "", // Add the id for update, empty for create
        ...formData,
      };

      if (onSubmit) {
        await onSubmit(finalFormData);
        setAlert({
          message: "Form submitted successfully!",
          type: "success",
        });
      }
    } catch (error: any) {
      setAlert({ message: `Error: ${error.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  });

  // Handle deletion
  const handleDelete = async () => {
    if (onDelete && data?.id) {
      try {
        setLoading(true);
        await onDelete(); // Handle delete logic
        setAlert({
          message: "Parent deleted successfully.",
          type: "success",
        });
      } catch (error: any) {
        setAlert({ message: `Error: ${error.message}`, type: "error" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Username</label>
          <input {...register("username")} />
          {errors.username && <span>{errors.username.message}</span>}
        </div>
        <div>
          <label>Parent Name</label>
          <input {...register("parentName")} />
          {errors.parentName && <span>{errors.parentName.message}</span>}
        </div>
        <div>
          <label>Surname</label>
          <input {...register("surname")} />
          {errors.surname && <span>{errors.surname.message}</span>}
        </div>
        <div>
          <label>Email</label>
          <input {...register("email")} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <label>Phone</label>
          <input {...register("phone")} />
          {errors.phone && <span>{errors.phone.message}</span>}
        </div>
        <div>
          <label>Address</label>
          <input {...register("address")} />
          {errors.address && <span>{errors.address.message}</span>}
        </div>

        <div>
          {alert && (
            <div className={alert.type === "error" ? "alert-error" : "alert-success"}>
              {alert.message}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : type === "update" ? "Update Parent" : "Add Parent"}
        </button>

        {type === "update" && (
          <button type="button" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Parent"}
          </button>
        )}
      </form>
    </div>
  );
};

export default ParentForm;
