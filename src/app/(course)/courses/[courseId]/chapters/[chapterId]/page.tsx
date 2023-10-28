import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma"
import { getChapterPlayer } from "@/actions/get-chapter-player";
import { Banner } from "@/components/common/banner";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/common/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";

export default async function ChapterIdPage({
	params
}: {
	params: { courseId: string; chapterId: string; }
}) {
	const { userId } = auth()

	if (!userId) {
		return redirect("/")
	}

	const { attachments, chapter, course, muxData, nextChapter, purchase, studentProgress } = await getChapterPlayer({
		chapterId: params.chapterId,
		courseId: params.courseId,
		userId
	})

	if (!course || !chapter) {
		return redirect("/")
	}

	const isLocked = !chapter.isFree && !purchase
	const completeOnEnd = !!purchase && !studentProgress?.isCompleted

	return (
		<div>
			{studentProgress?.isCompleted && (
				<Banner 
					label="You already completed this chapter"
					variant="success"
				/>
			)}
			{isLocked && (
				<Banner 
					label="You have to buy this course first"
					variant="warning"
				/>
			)}
			<div className="flex flex-col mx-auto pb-20 max-w-4xl">
				<div className="p-4">
					<VideoPlayer 
						chapterId={params.chapterId}
						courseId={params.courseId}
						title={chapter.title}
						nextChapterId={nextChapter?.id!}
						playbackId={muxData?.playbackId!}
						isLocked={isLocked}
						completeOnEnd={completeOnEnd}
					/>
				</div>			
				<div>
					<div className="flex flex-col p-4 md:flex-row items-center justify-between">
						<h2 className="text-2xl font-semibold mb-2">
							{chapter.title}
						</h2>
						{purchase ? (
							<CourseProgressButton 
								chapterId={params.chapterId}
								courseId={params.courseId}
								isCompleted={!!studentProgress?.isCompleted}
								nextChapterId={nextChapter?.id}
							/>
						) : (
							<CourseEnrollButton 
								price={course.price!}
								courseId={params.courseId}
							/>
						)}
					</div>
					<Separator />
					<div>
						<Preview value={chapter.description!} />
					</div>
					{!!attachments.length && (
						<>
							<Separator />
							<div className="p-4">
								{attachments.map((attachment) => (
									<a 
										href={attachment.url}
										target="_blank" 
										key={attachment.id}
										className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
									>
										<File />
										<p className="line-clamp-1">{attachment.name}</p>
									</a>
								))}
							</div>
						</>
					)}
				</div>
			</div>

		</div>
	)
}