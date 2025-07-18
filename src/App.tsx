import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CoursePanel } from "./components/CoursePanel";
import { Toaster } from "sonner";
import { Timetable } from "./components/Timetable";

import { useTimetable } from "./hooks/useTimetable";

function App() {
  const timetable = useTimetable();

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="my-6 text-center">강의 시간표 작성</h1>

          <div className="flex gap-6">
            {/* 시간표 */}
            <div className="flex-1">
              <Timetable timetable={timetable} />
            </div>

            {/* 강의 목록 패널 */}
            <div className="w-80">
              <CoursePanel
                courses={timetable.courses}
                onAddCourse={timetable.addCourse}
                onDeleteCourse={timetable.deleteCourse}
              />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </DndProvider>
  );
}

export default App;
