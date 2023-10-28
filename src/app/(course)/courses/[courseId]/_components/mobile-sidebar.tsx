import { Menu } from "lucide-react"
import { Chapter, Course, StudentProgress } from "@prisma/client"

import {
	Sheet,
	SheetContent,
	SheetTrigger
} from "@/components/ui/sheet"
import { CourseSidebar } from "./sidebar"

interface CourseMobileSidebarProps {
	course: Course & {
		chapters: (Chapter & { studentProgress: StudentProgress[] | null })[]
	};
	progress: number;
}

export const CourseMobileSidebar = ({
	course,
	progress
}: CourseMobileSidebarProps) => {
	return (
		<Sheet>
			<SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
				<Menu  />
			</SheetTrigger>
			<SheetContent side="left" className="p-0 bg-white w-72">
				<CourseSidebar 
					course={course}
					progress={progress}
				/>
			</SheetContent>	
		</Sheet>
	)
}