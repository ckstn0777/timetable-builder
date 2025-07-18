export interface Course {
  id: string;
  name: string; // 강의명
  color: string; // 색상
  credits: number; // 학점(or 중요도)
}

export interface ScheduledCourse {
  id: string;
  courseId: string;
  day: number; // 0: 일요일, 1: 월요일, ..., 6: 토요일
  startTime: number; // 분 단위 (360 = 6시)
  duration: number; // 분 단위
}

export interface TimetableSettings {
  startHour: number; // 시작 시간 (0-23)
  endHour: number; // 종료 시간 (1-24)
  activeDays: boolean[]; // 7개 요일의 활성화 상태 (일~토)
}
