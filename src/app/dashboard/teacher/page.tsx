import Announcements from "@/components/Announcements";
import BigCalenderContainer from "@/components/BigCalenderContainer";

const TeacherPage = () => {
  const teacherId = "70c8d87a-245c-4036-a6e7-5396f50a5e74";  // Example teacher ID, replace with actual data

  return (
    <div className="min-h-screen flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalenderContainer type="teacherId" id={teacherId} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;
