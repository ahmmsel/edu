import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function POST(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { userId } = auth()
		const { url } = await req.json()

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

		const attachment = await prisma.attachments.create({
			data: {
				url,
				courseId: params.courseId,
				name: url.split("/").pop()
			}
		})

		return NextResponse.json(attachment)
	} catch (error) {
		console.log(error, "ATTACHMENTS_ERROR")
		return new NextResponse("Internal Error", { status: 500 })
	}
}