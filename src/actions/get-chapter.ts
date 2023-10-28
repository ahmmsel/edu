import prisma from "@/lib/prisma"

export const getChapter = async (params: { courseId: string; chapterId: string; }) => {
	const chapter = await prisma.chapter.findUnique({
		where: {
			id: params.chapterId,
			courseId: params.courseId
		},
		include: {
			muxData: true
		}
	})

	return chapter
}