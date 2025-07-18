import { useEffect, useState } from "react";
import {
  loadFromStorage,
  saveToStorage,
  type TimetableData,
} from "@/lib/storage";
import { toast } from "sonner";
import { useCourses } from "./useCourses";
import { useScheduledCourses } from "./useScheduledCourses";
import { useTimetableSettings } from "./useTimetableSettings";

export function useTimetable() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);

  // 각 도메인별 훅
  const courses = useCourses();
  const scheduledCourses = useScheduledCourses();
  const settings = useTimetableSettings();

  // 강의 삭제 시 관련 스케줄도 함께 삭제
  const deleteCourseWithSchedules = (courseId: string) => {
    courses.deleteCourse(courseId);
    scheduledCourses.deleteSchedulesByCourse(courseId);
  };

  // 전체 초기화
  const resetAll = () => {
    courses.setCourses([]);
    scheduledCourses.setScheduledCourses([]);
    settings.resetSettings();
    setSelectedSchedule(null);
    toast.success("시간표가 초기화되었습니다.");
  };

  // 데이터 내보내기
  const exportData = () => ({
    courses: courses.courses,
    scheduledCourses: scheduledCourses.scheduledCourses,
    timetableSettings: settings.settings,
    version: "1.0.0",
    lastSaved: new Date().toISOString(),
  });

  // 데이터 가져오기
  const importData = (data: TimetableData) => {
    courses.setCourses(data.courses);
    scheduledCourses.setScheduledCourses(data.scheduledCourses);
    settings.setSettings(data.timetableSettings);
    toast.success("시간표를 성공적으로 가져왔습니다.");
  };

  // 초기 데이터 로드
  useEffect(() => {
    const data = loadFromStorage();
    if (data) {
      courses.setCourses(data.courses);
      scheduledCourses.setScheduledCourses(data.scheduledCourses);
      settings.setSettings(data.timetableSettings);
    }
    setIsLoading(false);
  }, []);

  // 데이터 변경 시 자동 저장(로컬스토리지)
  useEffect(() => {
    if (!isLoading) {
      const success = saveToStorage({
        courses: courses.courses,
        scheduledCourses: scheduledCourses.scheduledCourses,
        timetableSettings: settings.settings,
      });
      if (!success) {
        toast.error("데이터 저장에 실패했습니다.");
      }
    }
  }, [
    courses.courses,
    scheduledCourses.scheduledCourses,
    settings.settings,
    isLoading,
  ]);

  return {
    // 상태
    courses: courses.courses,
    scheduledCourses: scheduledCourses.scheduledCourses,
    settings: settings.settings,
    selectedSchedule: selectedSchedule,
    isLoading,

    // 강의 액션
    addCourse: courses.addCourse,
    deleteCourse: deleteCourseWithSchedules,

    // 스케줄 액션
    addScheduledCourse: scheduledCourses.addScheduledCourse,
    moveScheduledCourse: scheduledCourses.moveScheduledCourse,
    updateScheduledCourse: scheduledCourses.updateScheduledCourse,
    deleteScheduledCourse: scheduledCourses.deleteScheduledCourse,

    // 설정 액션
    updateSettings: settings.updateSettings,

    // UI 액션
    setSelectedSchedule,

    // 통합 액션
    exportData,
    importData,
    resetAll,
  };
}
