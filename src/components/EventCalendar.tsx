"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const router = useRouter(); // Import from "next/navigation"

  useEffect(() => {
    if (value instanceof Date) {
      const formattedDate = value.toISOString().split("T")[0]; // Format the date
      router.push(`?date=${formattedDate}`); // Navigate to the date query
    }
  }, [value, router]);

  return <Calendar onChange={onChange} value={value} />;
};

export default EventCalendar;
