import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function PUT(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { userId } = auth()

		if (!userId) return new NextResponse("Unauthorized", { status: 401 })

		const { list } = await req.json()

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

		for (let item of list) {
			await prisma.chapter.update({
				where: {
					id: item.id
				},
				data: {
					position: item.position
				}
			})
		}

		return NextResponse.json("Update The Chapters Order Successfully!")
	} catch (error) {
		console.log(error, "REORDER_ERROR")
		return new NextResponse("Internal Error", { status: 500  })
	}
}