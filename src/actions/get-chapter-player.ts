import { Attachments, Chapter } from "@prisma/client"

import prisma from "@/lib/prisma"

interface GetChapterPlayer {
	userId: string;
	courseId: string;
	chapterId: string;
}

export const getChapterPlayer = async ({
	userId,
	chapterId,
	courseId
}: GetChapterPlayer) => {
	try {
		const purchase = await prisma.purchase.findUnique({
			where: {
				userId_courseId: {
					userId,
					courseId
				}
			}
		})
	
		const course = await prisma.course.findUnique({
			where: {
				id: courseId,
				published: true
			},
			select: {
				price: true
			}
		})		

		const chapter = await prisma.chapter.findUnique({
			where: {
				id: chapterId,
				isPublished: true
			}
		})

		if (!chapter || !course) {
			throw new Error("Chapter Or Error Not Found")
		}

		let muxData = null
		let attachments: Attachments[] = []
		let nextChapter: Chapter | null = null

		if (purchase) {
			attachments = await prisma.attachments.findMany({
				where: {
					courseId
				}
			})
		}

		if (chapter.isFree || purchase) {
			muxData = await prisma.muxData.findUnique({
				where: {
					chapterId
				}
			})

			nextChapter = await prisma.chapter.findFirst({
				where: {
					courseId,
					isPublished: true,
					position: {
						gt: chapter?.position
					}
				},
				orderBy: {
					position: "asc"
				}
			})
		}

		const studentProgress = await prisma.studentProgress.findUnique({
			where: {
				userId_chapterId: {
					userId,
					chapterId
				}
			}
		})

		return {
			chapter,
			course,
			muxData,
			attachments,
			studentProgress,
			nextChapter,
			purchase
		}
	} catch (error) {
		console.log("GET_CHAPTER_PLAYER", error)
		return {
			chapter: null,
			course: null,
			muxData: null,
			attachments: [],
			nextChapter: null,
			studentProgress: null,
			purchase: null
		}
	}
}