import { useState } from "react";
import { toast } from "sonner";
import type { Course } from "@/types";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);

  // 강의 추가
  const addCourse = (course: Omit<Course, "id">) => {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
    };
    setCourses([...courses, newCourse]);
    toast.success("강의가 추가되었습니다.");
  };

  // 강의 삭제
  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    toast.success("강의가 삭제되었습니다.");
  };

  return {
    courses,
    setCourses, // 초기화용
    addCourse,
    deleteCourse,
  };
}
