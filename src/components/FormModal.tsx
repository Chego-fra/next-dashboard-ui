import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamically import the forms
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), { loading: () => <h1>Loading...</h1> });
const StudentForm = dynamic(() => import("./forms/StudentForm"), { loading: () => <h1>Loading...</h1> });
const ClassForm = dynamic(() => import("./forms/ClassForm"), { loading: () => <h1>Loading...</h1> });
const ParentForm = dynamic(() => import("./forms/ParentForm"), { loading: () => <h1>Loading...</h1> });
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), { loading: () => <h1>Loading...</h1> });
const LessonForm = dynamic(() => import("./forms/LessonForm"), { loading: () => <h1>Loading...</h1> });
const ExamForm = dynamic(() => import("./forms/ExamForm"), { loading: () => <h1>Loading...</h1> });
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"), { loading: () => <h1>Loading...</h1> });
const ResultForm = dynamic(() => import("./forms/ResultForm"), { loading: () => <h1>Loading...</h1> });
const AttendanceForm = dynamic(() => import("./forms/Attendance"), { loading: () => <h1>Loading...</h1> });
const EventForm = dynamic(() => import("./forms/EventForm"), { loading: () => <h1>Loading...</h1> });
const AnnouncementForm = dynamic(() => import("./forms/Announcement"), { loading: () => <h1>Loading...</h1> });
const GradeForm = dynamic(() => import("./forms/GradeForm"), { loading: () => <h1>Loading...</h1> });

// Import server actions
import { updateExam, deleteExam, updateAnnouncement, deleteAnnouncement, updateParent, deleteParent } from "@/lib/actions";

// Form mapping based on the table type
const forms: { [key: string]: (type: "create" | "update", data?: any) => JSX.Element } = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
  class: (type, data) => <ClassForm type={type} data={data} />,
  parent: (type, data) => (
    <ParentForm
      type={type}
      data={data}
      onSubmit={async (formData) => {
        const result = await updateParent(formData);
        if (result.success) {
          alert(result.message);
        } else {
          alert(result.message);
        }
      }}
      onDelete={async () => {
        const result = await deleteParent(data.id);
        if (result.success) {
          alert(result.message);
        } else {
          alert(result.message);
        }
      }}
    />
  ),
  subject: (type, data) => <SubjectForm type={type} data={data} />,
  lesson: (type, data) => <LessonForm type={type} data={data} />,
  exam: (type, data) => (
    <ExamForm
      type={type}
      data={data}
      onSubmit={async (formData) => {
        const result = await updateExam({ id: data.id, ...formData });
        if (result.success) {
          alert(result.message);
        } else {
          alert(result.message);
        }
      }}
    />
  ),
  assignment: (type, data) => <AssignmentForm type={type} data={data} />,
  result: (type, data) => <ResultForm type={type} data={data} />,
  attendance: (type, data) => <AttendanceForm type={type} data={data} />,
  event: (type, data) => <EventForm type={type} data={data} />,
  announcement: (type, data) => (
    <AnnouncementForm
      type={type}
      data={data}
      onSubmit={async (formData) => {
        const result = await updateAnnouncement({ id: data.id, ...formData });
        if (result.success) {
          alert(result.message);
        } else {
          alert(result.message);
        }
      }}
    />
  ),
  grade: (type, data) => <GradeForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
    | "grade";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDelete = async () => {
    if (id) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        let result;
        if (table === "exam") result = await deleteExam(id);
        else if (table === "announcement") result = await deleteAnnouncement(id);
        else if (table === "parent") result = await deleteParent(id);

        if (result?.success) {
          setSuccess(result.message);
        } else {
          setError(result?.message || "Unknown error occurred.");
        }
      } catch (err) {
        setError("Error deleting the record.");
      } finally {
        setLoading(false);
      }
    }
  };

  const Form = () => {
    return type === "delete" && id ? (
      <form
        action=""
        className="p-4 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleDelete();
        }}
      >
        <span className="text-center font-medium">
          Are you sure you want to delete this {table}?
        </span>
        <button
          type="submit"
          className="bg-red-500 text-white py-2 px-4 rounded-md border-none w-max self-center"
        >
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data)
    ) : (
      "Form not Found"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            {success && <div className="text-center text-green-500">{success}</div>}
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
