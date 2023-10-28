import { auth } from "@clerk/nextjs";
import { Chapter, Course, StudentProgress } from "@prisma/client"
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { CourseSidebarItem } from "./sidebar-item";
import { CourseProgress } from "@/components/common/course-progress";

interface CourseSidebarProps {
	course: Course & {
		chapters: (Chapter & { studentProgress: StudentProgress[] | null })[]
	};
	progress: number;
}

export const CourseSidebar = async ({
	course,
	progress
}: CourseSidebarProps) => {
	const { userId } = auth()

	if (!userId) return redirect("/")

	const purchase = await prisma.purchase.findUnique({
		where: {
			userId_courseId: {
				userId,
				courseId: course.id
			}
		}
	})

	return (
		<div className="h-full flex flex-col overflow-y-auto border-r shadow-sm">
			<div className="p-8 flex flex-col border-b">
				<h1 className="font-semibold ">
					{course.title}
				</h1>
				{purchase && (
					<div className="mt-10">
						<CourseProgress 
							variant="success"
							value={progress}
						/>
					</div>
				)}
			</div>
			<div className="flex flex-col w-full">
				{course.chapters.map((chapter) => (
						<CourseSidebarItem 
							key={chapter.id}
							id={chapter.id}
							isCompleted={!!chapter.studentProgress?.[0]?.isCompleted}
							isLocked={!chapter.isFree && !purchase}
							courseId={course.id}
							label={chapter.title}
						/>
				))}
			</div>
		</div>
	)
}