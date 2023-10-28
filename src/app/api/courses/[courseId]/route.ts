import Mux from "@mux/mux-node"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"


const { Video } = new Mux(
	process.env.MUX_TOKEN_ID!,
	process.env.MUX_TOKEN_SECRET!
)

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string } }
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

		for (const chapter of course.chapters) {
			if (chapter.muxData?.assetId) {
				await Video.Assets.del(chapter.muxData.assetId)
			}
		}

		const deletedCourse = await prisma.course.delete({
			where: {
				userId,
				id: params.courseId,
			},
		})

		return NextResponse.json(deletedCourse)
	} catch (error) {
		console.log("COURSE_DELETE_ERROR", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

export async function PATCH(
	req: Request,
	{ params } : { params: { courseId: string } }
) {
	try {
		const { userId } = auth()
		const { courseId } = params
		const values = await req.json()

		if (!userId) return new NextResponse("Unauthorized", { status: 401 })

		const updateCourse = await prisma.course.update({
			where: {
				id: courseId,
				userId
			},
			data: {
				...values
			}
		})

		return NextResponse.json(updateCourse)
	} catch(error) {
		console.log(error, "COURSE_UPDATE")
		return new NextResponse("Internal Error", { status: 500 })
	}
}