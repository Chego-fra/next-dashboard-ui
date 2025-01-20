"use client"
import { useEffect, useState } from 'react';
import BigCalendar from './BigCalender';

const BigCalendarContainer = ({ type, id }: { type: "teacherId" | "classId", id: string | number }) => {
  const [events, setEvents] = useState<any[]>([]);

  // Default data for testing
  const defaultEvents = [
    {
      id: 1,
      title: 'Math Class',
      start: new Date('2025-01-10T09:00:00'),
      end: new Date('2025-01-10T10:00:00'),
    },
    {
      id: 2,
      title: 'Science Class',
      start: new Date('2025-01-10T11:00:00'),
      end: new Date('2025-01-10T12:00:00'),
    },
    {
      id: 3,
      title: 'History Class',
      start: new Date('2025-01-11T08:30:00'),
      end: new Date('2025-01-11T09:30:00'),
    },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Simulate fetching data with default events if the API call fails
        const res = await fetch(`http://localhost:4000/api/getEventsByType?type=${type}&id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data); // Store events from the API
        } else {
          console.error('Error fetching events');
          setEvents(defaultEvents); // Use default events when API call fails
        }
      } catch (error) {
        console.error('Error:', error);
        setEvents(defaultEvents); // Use default events in case of an error
      }
    };

    fetchEvents();
  }, [type, id]); // Dependency array ensures this runs when type or id changes

  return <BigCalendar events={events} />;
};

export default BigCalendarContainer;
