import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Settings,
  Plus,
  Minus,
  Download,
  Upload,
  RefreshCw,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatHourToTimeString } from "@/lib/utils";
import { Label } from "./ui/label";
import { exportToFile, importFromFile } from "@/lib/storage";
import { TimetableCell } from "./TimetableCell";
import { ScheduledCourseBlock } from "./ScheduledCourseBlock";

import type { useTimetable } from "@/hooks/useTimetable";

interface TimetableProps {
  timetable: ReturnType<typeof useTimetable>;
}

const allDays = ["일", "월", "화", "수", "목", "금", "토"];

export function Timetable({ timetable }: TimetableProps) {
  const {
    courses,
    scheduledCourses,
    selectedSchedule,
    settings,
    addScheduledCourse,
    moveScheduledCourse,
    updateScheduledCourse,
    deleteScheduledCourse,
    updateSettings,
    setSelectedSchedule,
    exportData,
    importData,
    resetAll,
  } = timetable;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showSettings, setShowSettings] = useState(false);

  // 활성화된 요일 필터링
  const activeDays = allDays.filter((_, index) => settings.activeDays[index]);

  // 활성화된 요일 인덱스 배열. ex) [월, 화, 목] -> [1, 2, 4]
  const activeDayIndices = settings.activeDays
    .map((active, index) => (active ? index : -1))
    .filter((index) => index !== -1);

  // 시간 범위 계산
  // ex) 시작 시간 6시, 종료 시간 22시 -> 총 16시간. [6, 7, ..., 20, 21]
  // ex) 시작 시간 22시, 종료 시간 6시 -> 총 8시간. [22, 23, 0, 1, ..., 5]
  const totalHours =
    settings.endHour > settings.startHour
      ? settings.endHour - settings.startHour
      : 24 - settings.startHour + settings.endHour;
  const hours = Array.from({ length: totalHours }, (_, i) => {
    const hour = settings.startHour + i;
    return hour >= 24 ? hour - 24 : hour;
  });

  // 파일 내보내기
  const handleExportClick = () => {
    const data = exportData();
    const success = exportToFile(data);
    if (success) {
      toast.success("시간표가 파일로 저장되었습니다.");
    } else {
      toast.error("파일 저장에 실패했습니다.");
    }
  };

  // 파일 가져오기
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importFromFile(file);
      importData(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "파일 가져오기에 실패했습니다."
      );
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 시간 추가/제거
  const adjustTimeRange = (
    type: "start" | "end",
    direction: "add" | "remove"
  ) => {
    if (type === "start") {
      if (direction === "add") {
        updateSettings({ startHour: settings.startHour + 1 });
      } else if (direction === "remove") {
        updateSettings({ startHour: settings.startHour - 1 });
      }
    } else {
      if (direction === "add") {
        updateSettings({ endHour: settings.endHour + 1 });
      } else if (direction === "remove") {
        updateSettings({ endHour: settings.endHour - 1 });
      }
    }
  };

  // 요일 토글
  const toggleDay = (dayIndex: number) => {
    const newActiveDays = [...settings.activeDays];
    newActiveDays[dayIndex] = !newActiveDays[dayIndex];

    // 최소 1개 요일은 활성화되어야 함
    if (newActiveDays.some((active) => active)) {
      updateSettings({ activeDays: newActiveDays });
    }
  };

  // 스케줄 블록 밖을 클릭했을 때 선택 해제
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // ScheduledCourseBlock 밖을 클릭했을 때만 선택 해제
      const target = event.target as HTMLElement;

      // 클릭된 요소가 ScheduledCourseBlock인지 확인
      const isScheduleBlock = target.closest("[data-schedule-block]");

      if (!isScheduleBlock) {
        setSelectedSchedule(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Escape 키로도 선택 해제
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedSchedule(null);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3>시간표</h3>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleExportClick}
            >
              <Download size={16} />
              내보내기
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleImportClick}
            >
              <Upload size={16} />
              가져오기
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
              onClick={() =>
                toast("초기화하시겠습니까?", {
                  action: {
                    label: "초기화",
                    onClick: () => resetAll(),
                  },
                })
              }
            >
              <RefreshCw size={16} />
              초기화
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={16} />
              설정
            </Button>
          </div>
        </div>

        {/* 시간표 정보 */}
        <div className="mt-2 text-sm text-gray-600">
          강의 {courses.length}개 • 스케줄 {scheduledCourses.length}개 • 자동
          저장됨
        </div>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 설정 패널 */}
      {showSettings && (
        <div className="p-4 border-b bg-gray-50 space-y-4">
          {/* 시간 설정 */}
          <div>
            <Label className="mb-2 block">시간 범위</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustTimeRange("start", "remove")}
                >
                  <Minus size={14} />
                </Button>
                <span className="w-16 text-center">
                  {settings.startHour}:00
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustTimeRange("start", "add")}
                >
                  <Plus size={14} />
                </Button>
              </div>

              <span>~</span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustTimeRange("end", "remove")}
                >
                  <Minus size={14} />
                </Button>
                <span className="w-16 text-center">{settings.endHour}:00</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustTimeRange("end", "add")}
                >
                  <Plus size={14} />
                </Button>
              </div>
            </div>
          </div>
          {/* 요일 설정 */}
          <div>
            <Label className="mb-2 block">활성 요일</Label>
            <div className="flex gap-2">
              {allDays.map((day, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${index}`}
                    checked={settings.activeDays[index]}
                    onCheckedChange={() => toggleDay(index)}
                  />
                  <label
                    htmlFor={`day-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {day}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 도움말 */}
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} />
              <span className="font-medium">사용 방법</span>
            </div>
            <ul className="space-y-1 text-xs">
              <li>• 시간표는 자동으로 저장됩니다</li>
              <li>• 내보내기로 백업 파일을 생성할 수 있습니다</li>
              <li>• 가져오기로 백업 파일을 복원할 수 있습니다</li>
              <li>• 설정 변경 시 범위 밖 강의는 자동 삭제됩니다</li>
            </ul>
          </div>
        </div>
      )}

      {/* 시간표 테이블 */}
      <div className="relative p-4">
        <div
          className="grid min-w-full"
          style={{
            gridTemplateColumns: `auto repeat(${activeDays.length}, 1fr)`,
          }}
        >
          {/* 시간표 헤더 */}
          <div className="bg-gray-100 border border-gray-300 p-2 text-center sticky top-0 z-10">
            시간
          </div>
          {activeDays.map((day, index) => (
            <div
              key={index}
              className="bg-gray-100 border border-gray-300 p-2 text-center sticky top-0 z-10"
            >
              {day}
            </div>
          ))}

          {/* 시간 슬롯들 */}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              {/* 시간 라벨 */}
              <div className="bg-gray-50 border border-gray-300 p-2 text-center text-sm sticky left-0 z-10 h-12 flex items-center justify-center">
                {formatHourToTimeString(hour)}
              </div>

              {/* 각 요일의 셀 */}
              {activeDayIndices.map((dayIndex) => (
                <TimetableCell
                  key={dayIndex}
                  day={dayIndex}
                  hour={hour}
                  onScheduleCourse={addScheduledCourse}
                  onMoveCourse={moveScheduledCourse}
                >
                  {/* 해당 시간대의 강의들 렌더링 */}
                  {scheduledCourses
                    .filter((s) => s.day === dayIndex)
                    .map((schedule) => {
                      const course = courses.find(
                        (c) => c.id === schedule.courseId
                      );
                      if (!course) return null;

                      // 시간 범위 계산
                      const scheduleStartHour = Math.floor(
                        schedule.startTime / 60
                      );
                      const scheduleEndHour = Math.floor(
                        (schedule.startTime + schedule.duration) / 60
                      );

                      // 이 셀이 스케줄 시간에 포함되는지 확인
                      if (hour < scheduleStartHour || hour >= scheduleEndHour) {
                        return null;
                      }

                      // 첫번 째 셀에만 블록을 렌더링
                      if (hour !== scheduleStartHour) return null;

                      return (
                        <ScheduledCourseBlock
                          key={schedule.id}
                          schedule={schedule}
                          course={course}
                          isSelected={selectedSchedule === schedule.id}
                          onSelect={() => setSelectedSchedule(schedule.id)}
                          onUpdate={(updates) =>
                            updateScheduledCourse(schedule.id, updates)
                          }
                          onDelete={() => deleteScheduledCourse(schedule.id)}
                        />
                      );
                    })}
                </TimetableCell>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
