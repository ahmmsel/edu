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

		const chapter = await prisma.chapter.findUnique({
			where: {
				id: params.chapterId,
				courseId: params.courseId
			}
		})

		const muxData = await prisma.muxData.findUnique({
			where: {
				chapterId: params.chapterId
			}
		})

		if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
			return new NextResponse("Missing required fields", { status: 400 })
		}

		const publishedChapter = await prisma.chapter.update({
			where: {
				id: params.chapterId,
				courseId: params.courseId
			},
			data: {
				isPublished: true
			}
		})

		return NextResponse.json(publishedChapter)
	} catch (error) {
		console.log("PUBLISH_ERROR", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}