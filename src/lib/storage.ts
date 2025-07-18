import type { Course, ScheduledCourse, TimetableSettings } from "@/App";

const STORAGE_KEY = "timetable_data";
const CURRENT_VERSION = "1.0.0";

export interface TimetableData {
  courses: Course[];
  scheduledCourses: ScheduledCourse[];
  timetableSettings: TimetableSettings;
  version: string;
  lastSaved: string;
}

// localStorage에 데이터 저장
export const saveToStorage = (
  data: Omit<TimetableData, "version" | "lastSaved">
) => {
  try {
    const timetableData: TimetableData = {
      ...data,
      version: CURRENT_VERSION,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timetableData));
    return true;
  } catch (error) {
    console.error("시간표 데이터 저장 실패:", error);
    return false;
  }
};

// localStorage에서 데이터 로드
export const loadFromStorage = (): TimetableData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsedData = JSON.parse(data);

    return {
      courses: parsedData.courses,
      scheduledCourses: parsedData.scheduledCourses,
      timetableSettings: parsedData.timetableSettings,
      version: parsedData.version,
      lastSaved: parsedData.lastSaved,
    };
  } catch (error) {
    console.error("시간표 데이터 로드 실패:", error);
    return null;
  }
};

// localStorage 데이터 삭제
export const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
    return false;
  }
};

// 기본 설정 반환
export const getDefaultSettings = (): TimetableSettings => ({
  startHour: 6,
  endHour: 22,
  activeDays: [false, true, true, true, true, true, false],
});

// JSON 파일로 내보내기
export const exportToFile = (data: TimetableData) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `timetable_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
};

// JSON 파일에서 가져오기
export const importFromFile = (file: File): Promise<TimetableData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        // 데이터 유효성 검사
        if (
          !data.courses ||
          !Array.isArray(data.courses) ||
          !data.scheduledCourses ||
          !Array.isArray(data.scheduledCourses) ||
          !data.timetableSettings
        ) {
          throw new Error("Invalid file format");
        }

        // 기본값 설정
        const timetableData: TimetableData = {
          courses: data.courses,
          scheduledCourses: data.scheduledCourses,
          timetableSettings: data.timetableSettings,
          version: data.version || CURRENT_VERSION,
          lastSaved: data.lastSaved || new Date().toISOString(),
        };

        resolve(timetableData);
      } catch (error) {
        reject(new Error("파일 형식이 올바르지 않습니다."));
      }
    };

    reader.onerror = (event) => {
      reject(new Error("파일을 읽을 수 없습니다."));
    };

    reader.readAsText(file);
  });
};
