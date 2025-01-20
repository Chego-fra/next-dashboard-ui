import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChatContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalenderContainer";

import FinaceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";

const AdminPage = ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT SECTION */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="students" />
          <UserCard type="teachers" />
          <UserCard type="parents" />
          <UserCard type="staffs" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinaceChart />
        </div>
      </div>
      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        {/* EVENT CALENDAR */}
        <EventCalendarContainer searchParams={searchParams} />
        {/* ANNOUNCEMENTS */}
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
