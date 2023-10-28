import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma"

export async function PUT(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string; } }
) {
	try {
		const { userId } = auth()
		const { isCompleted } = await req.json()

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		const studentProgress = await prisma.studentProgress.upsert({
			where: {
				userId_chapterId: {
					userId,
					chapterId: params.chapterId
				},
			},
			update: {
				isCompleted
			},
			create: {
				userId,
				chapterId: params.chapterId,
				isCompleted
			}
		})

		return NextResponse.json(studentProgress)
	} catch (error) {
		console.log("PROGRESS_ERROR", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}