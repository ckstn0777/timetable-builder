import { useCallback } from "react";
import { useDrop } from "react-dnd";

interface TimetableCellProps {
  day: number;
  hour: number;
  onScheduleCourse: (
    courseId: string,
    day: number,
    startTime: number,
    duration: number
  ) => void;
  onMoveCourse: (scheduleId: string, day: number, startTime: number) => void;
  children?: React.ReactNode;
}

export function TimetableCell({
  day,
  hour,
  onScheduleCourse,
  onMoveCourse,
  children,
}: TimetableCellProps) {
  const [{ isOver }, dropRef] = useDrop({
    accept: ["course", "scheduled-course"],
    drop: (item: { courseId?: string; scheduleId?: string }) => {
      const startTime = hour * 60; // 정시 시작

      if (item.courseId) {
        // 새 강의 추가
        const duration = 60; // 1시간 기본
        onScheduleCourse(item.courseId, day, startTime, duration);
      } else if (item.scheduleId) {
        // 기존 강의 이동
        onMoveCourse(item.scheduleId, day, startTime);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const setDropRef = useCallback(
    (node: HTMLDivElement | null) => {
      dropRef(node);
    },
    [dropRef]
  );

  return (
    <div
      ref={setDropRef}
      className={`
        relative border border-gray-300 h-12 bg-white
        ${isOver ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"}
        transition-colors duration-200
      `}
    >
      {children}
    </div>
  );
}
