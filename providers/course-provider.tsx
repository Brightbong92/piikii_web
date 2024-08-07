"use client";
import { RoomResponse } from "@/apis/room/types/model";
import { ScheduleResponse } from "@/apis/schedule/types/model";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface CourseContextType {
  roomInfo: RoomResponse | null;
  setRoomInfo: (info: RoomResponse | null) => void;
  categoryList: ScheduleResponse[] | null;
  setCategoryList: (data: ScheduleResponse[] | null) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [roomInfo, setRoomInfo] = useState<RoomResponse | null>(null);
  const [categoryList, setCategoryList] = useState<ScheduleResponse[] | null>(
    null
  );

  return (
    <CourseContext.Provider
      value={{ roomInfo, setRoomInfo, categoryList, setCategoryList }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
};
