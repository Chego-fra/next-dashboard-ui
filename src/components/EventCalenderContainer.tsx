import EventCalendar from "./EventCalendar";
import EventList from "./EventList";
import Image from "next/image";

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;

  return (
    <div className="bg-white p-4 rounded-md">
      <EventCalendar />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="More" width={20} height={20} />
      </div>
      <EventList dateParam={date} />
    </div>
  );
};

export default EventCalendarContainer;
