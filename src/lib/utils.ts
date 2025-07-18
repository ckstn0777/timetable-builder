import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 시간을 문자열로 변환하는 함수
// ex) 6 -> "06:00", 12 -> "12:00"
export const formatHourToTimeString = (hours: number) => {
  return `${hours.toString().padStart(2, "0")}:00`;
};
