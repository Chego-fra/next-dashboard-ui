"use client"
import { useEffect, useState } from "react";
import axios from "axios";

interface Event {
  eventId: number;
  eventTitle: string;
  description: string;
  startTime: string;
  endTime: string;
}

const EventList = ({ dateParam }: { dateParam: string | undefined }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dateParam) return;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:4000/api/getEventsByDate`, {
          params: { date: dateParam },
        });
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [dateParam]);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;
  if (events.length === 0) return <p>No events for this date.</p>;

  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <div
          className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
          key={event.eventId}
        >
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-gray-600">{event.eventTitle}</h1>
            <span className="text-gray-300 text-xs">
              {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()}
            </span>
          </div>
          <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
        </div>
      ))}
    </div>
  );
};

export default EventList;
