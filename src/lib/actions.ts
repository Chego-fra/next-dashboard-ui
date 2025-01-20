"use server";

export const updateAnnouncement = async (data: {
  id: number;
  announcementTitle?: string;
  description?: string;
  date?: string;
  className?: string;
}) => {
  try {
    const response = await fetch(`http://localhost:4000/api/updateAnnouncement/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update announcement");
    }

    return { success: true, message: "Announcement updated successfully!" };
  } catch (error: any) {
    console.error("Error updating announcement:", error.message);
    return { success: false, message: error.message };
  }
};



export const deleteAnnouncement = async (id: number) => {
    try {
        const response = await fetch(`http://localhost:4000/api/deleteAnnouncement/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete announcement");
        }

        return { success: true, message: "Announcement deleted successfully!" };
    } catch (error: any) {
        console.error("Error deleting announcement:", error.message);
        return { success: false, message: error.message };
    }
};


// server/actions/examActions.ts
export const updateExam = async (data: {
  id: number;
  examTitle?: string;
  startTime?: string;
  endTime?: string;
  lessonName?: string;
}) => {
  try {
    const response = await fetch(`http://localhost:4000/api/updateExam/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update exam');
    }

    return { success: true, message: 'Exam updated successfully!' };
  } catch (error: any) {
    console.error('Error updating exam:', error.message);
    return { success: false, message: error.message };
  }
};



// server/actions/examActions.ts
export const deleteExam = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:4000/api/deleteExam/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete exam');
    }

    return { success: true, message: 'Exam deleted successfully!' };
  } catch (error: any) {
    console.error('Error deleting exam:', error.message);
    return { success: false, message: error.message };
  }
};



export const updateParent = async (data: {
  id: number;
  username?: string;
  parentName?: string;
  surname?: string;
  email?: string;
  phone?: string;
  address?: string;
}) => {
  try {
    const response = await fetch(`http://localhost:4000/api/updateParent/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update parent");
    }

    return { success: true, message: "Parent updated successfully!" };
  } catch (error: any) {
    console.error("Error updating parent:", error.message);
    return { success: false, message: error.message };
  }
};

export const deleteParent = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:4000/api/deleteParent/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete parent");
    }

    return { success: true, message: "Parent deleted successfully!" };
  } catch (error: any) {
    console.error("Error deleting parent:", error.message);
    return { success: false, message: error.message };
  }
};
