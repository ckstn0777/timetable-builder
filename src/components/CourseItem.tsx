import { GripVertical, Trash2 } from "lucide-react";
import { useDrag } from "react-dnd";
import { Button } from "./ui/button";

import type { Course } from "@/types";
import { useCallback } from "react";

interface CourseItemProps {
  course: Course;
  onDelete: () => void;
}

export function CourseItem({ course, onDelete }: CourseItemProps) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "course",
    item: { courseId: course.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const setDragRef = useCallback(
    (node: HTMLDivElement | null) => {
      dragRef(node);
    },
    [dragRef]
  );

  return (
    <div
      ref={setDragRef}
      className={`
        flex items-center gap-3 p-3 border rounded-lg cursor-move
        ${isDragging ? "opacity-50" : "hover:shadow-md"}
        transition-all duration-200
      `}
    >
      {/* 드래그 핸들 */}
      <GripVertical size={16} className="text-gray-400" />

      {/* 색상 표시 */}
      <div
        className="w-4 h-4 rounded-full flex-shrink-0"
        style={{ backgroundColor: course.color }}
      />

      {/* 강의 정보 */}
      <div className="flex-1 min-w-0">
        <div className="truncate">{course.name}</div>
        <div className="text-xs text-gray-500">{course.credits}학점</div>
      </div>

      {/* 삭제 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-gray-400 hover:text-red-500"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}
