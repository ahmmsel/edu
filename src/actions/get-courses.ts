import { Course, Category } from "@prisma/client"

import prisma from "@/lib/prisma"
import { getProgress } from "./get-progress";

type CourseInformation = Course & {
	category: Category | null;
	progress: number | null;
	chapters: { id: string }[]
}

type GetCourses = {
	userId: string;
	title?: string;
	categoryId?: string;
}

export const getCourses = async ({
	userId,
	title,
	categoryId
}: GetCourses): Promise<CourseInformation[] | []> => {
	try {
		const courses = await prisma.course.findMany({
			where: {
				published: true,
				title: {
					contains: title
				},
				categoryId
			},
			include: {
				category: true,
				chapters: {
					where: {
						isPublished: true
					},
					select: {
						id: true
					}
				},
				purchases: {
					where: {
						userId
					}
				}
			},
			orderBy: {
				createdAt: "desc"
			}
		})

		const formattedCourses: CourseInformation[] = await Promise.all(
			courses.map(async (course) => {
				if (course.purchases.length === 0) {
					return {
						...course,
						progress: null
					}
				}

				const progressPercentage = await getProgress(userId, course.id)

				return {
					...course,
					progress: progressPercentage
				}
			})
		) 


		return formattedCourses
	} catch (error) {
		console.log("GET_COURSES", error)
		return []
	}
}