import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CourseForm } from "./CourseForm";
import { CourseItem } from "./CourseItem";
import type { Course } from "@/types";

interface CoursePanelProps {
  courses: Course[];
  onAddCourse: (course: Omit<Course, "id">) => void;
  onDeleteCourse: (id: string) => void;
}

export function CoursePanel({
  courses,
  onAddCourse,
  onDeleteCourse,
}: CoursePanelProps) {
  const [showForm, setShowForm] = useState(false);

  // 강의 목록 내 강의 순서 변경을 드래그 앤 드랍으로 변경 가능하게 할지 고민?
  // 그냥 학점(중요도) 순으로 정렬해서 보여주는 게 가장 깔끔한 거 같기도 하고. ㅇㅇ

  // 강의 목록 내 드랍 존
  // const [{ isOver }, dropRef] = useDrop({
  //   accept: "course",
  //   drop: (item: { id: string }, monitor) => {
  //     // 시간표에서 드랍된 것이 아닌 경우만 처리
  //     if (!monitor.didDrop()) {
  //       // 강의 목록 내에서 순서 변경은 CourseItem에서 처리
  //       return;
  //     }
  //   },
  //   collect: (monitor) => ({
  //     isOver: monitor.isOver(),
  //   }),
  // });

  // order 기준으로 정렬된 강의 목록
  // const sortedCourses = [...courses].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h3>강의 목록</h3>
        <Button
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} />
          강의 추가
        </Button>
      </div>
      <div className="p-4">
        {showForm && (
          <div className="mb-4">
            <CourseForm
              onSubmit={(formData) => {
                onAddCourse(formData);
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="space-y-2">
          {courses.length === 0 && !showForm && (
            <p className="text-gray-500 text-center py-8">
              강의를 추가해주세요
            </p>
          )}

          {courses
            .sort((a, b) => b.credits - a.credits)
            .map((course) => (
              <CourseItem
                key={course.id}
                course={course}
                onDelete={() => onDeleteCourse(course.id)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
