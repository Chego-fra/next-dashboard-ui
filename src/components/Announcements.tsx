"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Announcement = {
  announcementId: number;
  announcementTitle: string;
  description: string;
  date: string;
  Class?: {
    className: string;
  };
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/getAllAnnouncements");
        setAnnouncements(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-1">Announcements</h1>
        <span className="text-gray-400 text-xs cursor-pointer">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.announcementId}
            className="bg-lamaSkyLight rounded-md p-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{announcement.announcementTitle}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Date(announcement.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {announcement.description || "No description provided."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
