import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"

import prisma from "@/lib/prisma"

export async function POST(
	req: Request
) {
	try {
		const { userId } = auth()
		const { title } = await req.json()

		if (!userId) return new NextResponse("Unauthorized")

		const course = await prisma.course.create({
			data: {
				userId,
				title
			}
		})

		return NextResponse.json(course, { status: 201 })
	} catch(error) {
		console.log(error, "NEW_COURSES")
		return new NextResponse("Internal Error", { status: 500 })
	}
}