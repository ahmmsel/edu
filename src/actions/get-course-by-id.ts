import prisma from "@/lib/prisma"

export const getCourseById = async (courseId: string) => {
	const course = await prisma.course.findUnique({
		where: {
			id: courseId
		},
		include: {
			attachments: {
				orderBy: {
					createdAt: "desc"
				}
			},
			chapters: {
				orderBy: {
					position: "asc"
				}
			}
		}
	})

	return course
}