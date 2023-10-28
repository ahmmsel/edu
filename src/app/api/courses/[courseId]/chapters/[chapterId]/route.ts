import Mux from "@mux/mux-node"
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma"

const { Video } = new Mux(
	process.env.MUX_TOKEN_ID!,
	process.env.MUX_TOKEN_SECRET!
)

export async function DELETE(
	req: Request,
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

		if (!chapter) {
			return new NextResponse("Not Found", { status: 404 })
		}

		if (chapter.videoUrl) {
			const existing = await prisma.muxData.findFirst({
				where: {
					chapterId: params.chapterId
				}
			})

			if (existing) {
				await Video.Assets.del(existing.assetId)
				await prisma.muxData.delete({
					where: {
						id: existing.id
					}
				})
			}
		}

		const deletedChapter = await prisma.chapter.delete({
			where: {
				id: params.chapterId
			}
		})

		const publishedChapters = await prisma.chapter.findMany({
			where: {
				courseId: params.courseId,
				isPublished: true
			}
		})

		if (!publishedChapters.length) {
			await prisma.course.update({
				where: {
					id: params.courseId,
				},
				data: {
					published: false
				}
			})
		}

		return NextResponse.json(deletedChapter)
	} catch (error) {
		console.log("DELETE_CHAPTER", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
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

		const { isPublished, ...values } = await req.json()

		const chapter = await prisma.chapter.update({
			where: {
				id: params.chapterId,
				courseId: params.courseId
			},
			data: {
       ...values
			}
		})

		if (values.videoUrl) {
			const existing = await prisma.muxData.findFirst({
				where: {
					chapterId: params.chapterId
				}
			})

			if (existing) {
				await Video.Assets.del(existing.assetId)
				await prisma.muxData.delete({
					where: {
						id: existing.id
					}
				})
			}

			const asset = await Video.Assets.create({
				input: values.videoUrl,
				playback_policy: "public",
				test: false
			})

			await prisma.muxData.create({
				data: {
					chapterId: params.chapterId,
					assetId: asset.id,
					playbackId: asset.playback_ids?.[0].id
				}
			})
		}

		return NextResponse.json(chapter)
	} catch (error) {
		console.log(error, "SINGLE_CHAPTER_ERROR")
		return new NextResponse("Internal Error", { status: 500 })
	}
}