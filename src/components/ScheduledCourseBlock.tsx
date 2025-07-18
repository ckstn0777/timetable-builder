import React, { useCallback, useState } from "react";
import { useDrag } from "react-dnd";
import { Move, X } from "lucide-react";
import type { ScheduledCourse, Course } from "@/types";

interface ScheduledCourseBlockProps {
  schedule: ScheduledCourse;
  course: Course;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ScheduledCourse>) => void;
  onDelete: () => void;
}

export function ScheduledCourseBlock({
  schedule,
  course,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}: ScheduledCourseBlockProps) {
  const [isResizing, setIsResizing] = useState(false);

  const CELL_HEIGHT = 42; // h-12(font-size: 14px)
  const CELL_DURATION = 60; // 한 셀은 60분(1시간)

  // 높이 계산 (1시간 = 42px, 셀 높이가 42px)
  const height = (schedule.duration / CELL_DURATION) * CELL_HEIGHT;

  // 시작 시간으로 초기 위치 계산. 예) 01:40 -> 40분 -> 40/60 * 42 = 28px
  const top = ((schedule.startTime % CELL_DURATION) / 60) * CELL_HEIGHT;

  // 드래그 기능
  const [{ isDragging }, dragRef] = useDrag({
    type: "scheduled-course",
    item: { scheduleId: schedule.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !isResizing, // 리사이징 중일 때는 드래그 불가
  });

  // 시작 시간 포맷팅
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  // 마우스 다운 핸들러 (리사이징 시작)
  const handleMouseDown = (e: React.MouseEvent, type: "top" | "bottom") => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - e.clientY;
      const deltaMinutes = Math.round(((deltaY / CELL_HEIGHT) * 60) / 10) * 10; // 10분 단위

      if (type === "bottom") {
        const newDuration = Math.max(10, schedule.duration + deltaMinutes);
        onUpdate({ duration: newDuration });
      } else if (type === "top") {
        const newStartTime = Math.max(0, schedule.startTime + deltaMinutes);
        const newDuration = Math.max(10, schedule.duration - deltaMinutes);
        onUpdate({ startTime: newStartTime, duration: newDuration });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const setDragRef = useCallback(
    (node: HTMLDivElement | null) => {
      dragRef(node);
    },
    [dragRef]
  );

  return (
    <div
      data-schedule-block
      className={`absolute inset-x-0 text-white text-sm overflow-hidden ${
        isSelected ? "ring-2 ring-blue-400" : ""
      } ${isDragging ? "opacity-50" : ""} ${
        isResizing ? "user-select-none" : ""
      }`}
      style={{
        backgroundColor: course.color,
        height: `${height}px`,
        top: `${top}px`,
        zIndex: isSelected ? 10 : 5,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* 상단 리사이즈 핸들 */}
      {isSelected && (
        <div
          className="absolute top-0 left-0 right-0 h-1 cursor-n-resize"
          onMouseDown={(e) => handleMouseDown(e, "top")}
        />
      )}

      {/* 메인 콘텐츠 영역 - 드래그 가능 */}
      <div ref={setDragRef} className="p-2 h-full cursor-move">
        {/* 강의 정보 */}
        <div className="flex justify-between items-start mb-0.5">
          <div className="flex-1 min-w-0">
            <div className="truncate font-medium text-xs leading-tight">
              {course.name}
            </div>
          </div>

          {/* 컨트롤 버튼들 */}
          <div className="flex items-center gap-1 ml-2">
            {/* 이동 아이콘 */}
            {isSelected && (
              <div className="text-white opacity-75 hover:opacity-100">
                <Move size={12} />
              </div>
            )}

            {/* 삭제 버튼 */}
            {isSelected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-white hover:text-red-200 transition-colors flex-shrink-0"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* 시간 정보 */}
        {height >= CELL_HEIGHT && (
          <div className="text-xs opacity-90 leading-tight">
            {formatTime(schedule.startTime)} -{" "}
            {formatTime(schedule.startTime + schedule.duration)}
          </div>
        )}
      </div>

      {/* 하단 리사이즈 핸들 */}
      {isSelected && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize"
          onMouseDown={(e) => handleMouseDown(e, "bottom")}
        />
      )}
    </div>
  );
}
