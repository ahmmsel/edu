import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string, attachmentId: string } }
) {
	try {
		const { userId } = auth()

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

		const attachment = await prisma.attachments.delete({
			where: {
				courseId: params.courseId,
				id: params.attachmentId
			}
		})

		return NextResponse.json(attachment)
	} catch (error) {
		console.log(error, "ATTACHMENT_ID")
		return new NextResponse("Internal Error", { status: 500 })
	}
}