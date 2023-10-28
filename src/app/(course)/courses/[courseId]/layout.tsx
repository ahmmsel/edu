import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma"
import { getProgress } from "@/actions/get-progress";
import { CourseSidebar } from "./_components/sidebar"
import { CourseNavbar } from "./_components/course-navbar";

export default async function CourseLayout({
	children,
	params
}: {
	children: React.ReactNode;
	params: { courseId: string }
}) {
	const { userId } = auth()

	if (!userId) return redirect("/")

	const course = await prisma.course.findUnique({
		where: {
			id: params.courseId,
			published: true
		},
		include: {
			chapters: {
				where: {
					isPublished: true
				},
				orderBy: {
					position: "asc"
				},
				include: {
					studentProgress: {
						where: {
							userId
						}
					}
				}
			}
		}
	})

	if (!course) return redirect("/")

	const progress = await getProgress(userId, params.courseId)

	return (
		<div className="h-full">
		<div className="h-[80px] md:pl-80 fixed w-full z-50 inset-y-0">
			<CourseNavbar 
				course={course}
				progress={progress}
			/>
		</div>
		  <div className="hidden md:flex w-80 h-full flex-col fixed inset-y-0 z-50">
		  	<CourseSidebar 
		  		course={course}
		  		progress={progress}
		  	/>
		  </div>
			<main className="md:pl-80 pt-[80px] h-full">
				{children}		
			</main>
		</div>
	)
}