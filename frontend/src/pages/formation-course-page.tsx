import { Navigate, useParams } from "react-router-dom";
import { CjpDashboardPage } from "@/components/cjp/cjp-dashboard-page";
import { AcademyCoursePlayer } from "@/features/formations/components/academy-course-player";
import { getCoursePlayerData } from "@/features/formations/data/course-player-data";

export function FormationCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? getCoursePlayerData(courseId) : undefined;

  if (!course) {
    return <Navigate to="/dashboard/formations" replace />;
  }

  return (
    <CjpDashboardPage fullWidth hideSidebar bare>
      <AcademyCoursePlayer course={course} />
    </CjpDashboardPage>
  );
}
