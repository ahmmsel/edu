import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function PATCH(
	_req: Request,
	{ params } : { params: { courseId: string } }
) {
	try {
		const { userId } = auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const course = await prisma.course.findUnique({
			where: {
				id: params.courseId,
				userId
			},
			include: {
				chapters: {
					include: {
						muxData: true
					}
				}
			}
		})

		if (!course) {
			return new NextResponse("Course Not Found", { status: 404 })
		}

		const hasPublishedChapters = course.chapters.some((chapter) => chapter.isPublished) 

		if (!course.title || !course.description || !course.categoryId || !course.imageUrl || !hasPublishedChapters) {
			return new NextResponse("Missing Required Fields", { status: 404 })
		}

		const publishedCourse = await prisma.course.update({
			where: {
				id: params.courseId,
				userId
			},
			data: {
				published: true
			}
		})

		return NextResponse.json(publishedCourse)
	} catch (error) {
		console.log("PUBLISH_COURSE", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}