import { useState } from "react";
import type { ScheduledCourse } from "@/types";

export function useScheduledCourses() {
  const [scheduledCourses, setScheduledCourses] = useState<ScheduledCourse[]>(
    []
  );

  // 강의 스케줄 추가
  const addScheduledCourse = (
    courseId: string,
    day: number,
    startTime: number,
    duration: number
  ) => {
    const newScheduledCourse: ScheduledCourse = {
      id: Date.now().toString(),
      courseId,
      day,
      startTime,
      duration,
    };
    setScheduledCourses([...scheduledCourses, newScheduledCourse]);
  };

  // 강의 스케줄 이동
  const moveScheduledCourse = (
    scheduleId: string,
    day: number,
    startTime: number
  ) => {
    setScheduledCourses((prev) =>
      prev.map((s) => (s.id === scheduleId ? { ...s, day, startTime } : s))
    );
  };

  // 강의 스케줄 업데이트
  const updateScheduledCourse = (
    scheduleId: string,
    updates: Partial<ScheduledCourse>
  ) => {
    setScheduledCourses((prev) =>
      prev.map((s) => (s.id === scheduleId ? { ...s, ...updates } : s))
    );
  };

  // 강의 스케줄 삭제
  const deleteScheduledCourse = (scheduleId: string) => {
    setScheduledCourses((prev) => prev.filter((s) => s.id !== scheduleId));
  };

  // 특정 강의의 모든 스케줄 삭제
  const deleteSchedulesByCourse = (courseId: string) => {
    setScheduledCourses((prev) => prev.filter((s) => s.courseId !== courseId));
  };

  return {
    scheduledCourses,
    setScheduledCourses, // 초기화용
    addScheduledCourse,
    moveScheduledCourse,
    updateScheduledCourse,
    deleteScheduledCourse,
    deleteSchedulesByCourse,
  };
}
