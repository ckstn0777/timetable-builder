import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

import type { Course } from "@/types";

const colors = [
  "#3B82F6", // blue
  "#EF4444", // red
  "#10B981", // emerald
  "#F59E0B", // amber
  "#8B5CF6", // violet
  "#06B6D4", // cyan
  "#F97316", // orange
  "#84CC16", // lime
  "#EC4899", // pink
  "#6B7280", // gray
];

interface CourseFormProps {
  onSubmit: (formData: Omit<Course, "id">) => void;
  onCancel: () => void;
}

export function CourseForm({ onSubmit, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    color: colors[0],
    credits: 3,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.name.trim() === "") {
      alert("강의명을 입력해주세요");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form
      className="space-y-4 p-4 border rounded-lg bg-gray-50"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor="courseName">강의명</Label>
        <Input
          id="courseName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="강의명을 입력해주세요"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="credits">학점</Label>
        <Input
          id="credits"
          type="number"
          min={1}
          max={6}
          value={formData.credits}
          onChange={(e) =>
            setFormData({ ...formData, credits: parseInt(e.target.value) })
          }
        />
      </div>
      <div className="space-y-2">
        <Label>색상</Label>
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <div
              key={color}
              className={`w-8 h-8 rounded border-2 ${
                formData.color === color ? "border-gray-800" : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setFormData({ ...formData, color })}
            ></div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          추가
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          취소
        </Button>
      </div>
    </form>
  );
}
