import { Category, Chapter, Course } from "@prisma/client";

import prisma from "@/lib/prisma";
import { getProgress } from "@/actions/get-progress";

type CourseInformation = Course & {
	chapters: Chapter[];
	category: Category;
	progress: number | null;
}

type DashboardCourses = {
	completedCourses: CourseInformation[];
	coursesInProgress: CourseInformation[];
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
	try {
		const purchasedCourses = await prisma.purchase.findMany({
			where: {
				userId
			},
			select: {
				course: {
					include: {
						category: true,
						chapters: {
							where: {
								isPublished: true
							}
						}
					}
				}
			}
		})

		const courses = purchasedCourses.map((purchase) => purchase.course) as CourseInformation[]

		for (let course of courses) {
			const progress = await getProgress(userId, course.id)
			course["progress"] = progress
		}

		const completedCourses = courses.filter((course) => course.progress === 100)
		const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100)

		return {
			completedCourses,
			coursesInProgress
		}
	} catch (error) {
		console.log("GET_COURSES_DASHBOARD", error)
		return {
			completedCourses: [],
			coursesInProgress: []
		}
	}
}