import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma"

export async function PATCH(
	_req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { userId } = auth()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// Check Course Owner
		const isOwner = await prisma.course.findUnique({
			where: {
				id: params.courseId,
				userId
			}
		})

		if (!isOwner) {
			return new NextResponse("Forbidden Request", { status: 403 })
		}

		const unPublishedChapter = await prisma.chapter.update({
			where: {
				id: params.chapterId,
				courseId: params.courseId
			},
			data: {
				isPublished: false
			}
		})

		const publishedChapter = await prisma.chapter.findMany({
			where: {
				courseId: params.courseId,
				isPublished: true
			}
		})

		if (!publishedChapter.length) {
			await prisma.course.update({
				where: {
					id: params.courseId
				},
				data: {
					published: false
				}
			})
		}

		return NextResponse.json(unPublishedChapter)
	} catch (error) {
		console.log("UNPUBLISH_ERROR", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}