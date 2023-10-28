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
			return new NextResponse("Not Found", { status: 404 })
		}

		const hasPublishedChapters = course.chapters.some(chapter => chapter.isPublished) 

		const unPublishedCourse = await prisma.course.update({
			where: {
				id: params.courseId,
				userId
			},
			data: {
				published: false
			}
		})

		return NextResponse.json(unPublishedCourse)
	} catch (error) {
		console.log("UNPUBLISH_COURSE", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}