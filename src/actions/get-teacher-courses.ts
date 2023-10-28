import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import prisma from "@/lib/prisma"

export const getTeacherCourses = async () => {
	const { userId } = auth()

	if (!userId) {
		return redirect("/")
	}

	const courses = await prisma.course.findMany({
		where: {
			userId
		},
		orderBy: {
			createdAt: "desc"
		}
	})

	return courses
}