import { Chapter, Course, StudentProgress } from "@prisma/client";

import { NavbarLinks } from "@/components/common/navbar-links";
import { CourseMobileSidebar } from "./mobile-sidebar";

interface CourseNavbarProps {
	course: Course & {
		chapters: (Chapter & { studentProgress: StudentProgress[] | null })[]
	};
	progress: number;
}

export const CourseNavbar = ({
	course,
	progress
}: CourseNavbarProps) => {
	return (
		<div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
			<CourseMobileSidebar 
				course={course}
				progress={progress}
			/>
			<NavbarLinks />
		</div>
	)
}