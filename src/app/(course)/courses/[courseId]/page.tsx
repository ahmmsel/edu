import { redirect } from "next/navigation"

import prisma from "@/lib/prisma"

export default async function CourseIdPage({
	params
}: {
	params: { courseId: string }
}) {
	const course = await prisma.course.findUnique({
		where: {
			id: params.courseId
		},
		include: {
			chapters: {
				where: {
					isPublished: true
				},
				orderBy: {
					position: "asc"
				}
			}
		}
	})

	if (!course) return redirect("/")

	return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`)
}