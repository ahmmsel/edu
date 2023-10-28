import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs"


export async function POST(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { userId } = auth()
		const { title } = await req.json()

		if (!userId) return new NextResponse("Unauthorized", { status: 401 })

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

		const lastChapter = await prisma.chapter.findFirst({
			where: {
				courseId: params.courseId
			},
			orderBy: {
				position: "desc"
			}
		})

		const startPosition = lastChapter ? lastChapter.position + 1 : 1

		const createdChapter = await prisma.chapter.create({
			data: {
				title,
				courseId: params.courseId,
				position: startPosition
			}
		})

		return NextResponse.json(createdChapter)
	} catch (error) {
		console.log(error, "CHAPTERS_ERROR")
		return new NextResponse("Internal Error", { status: 500 })
	}
}