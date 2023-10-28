import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Badge } from "@/components/common/badge";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { AccessForm } from "./_components/access-form";
import { VideoForm } from "./_components/video-form";
import { Banner } from "@/components/common/banner";
import { ChapterActions } from "./_components/chapter-actions";

export default async function SingleChapterPage({
	params
}: {
	params: { courseId: string; chapterId: string }
}) {
	const { userId } = auth()

	if (!userId) {
		return redirect("/")
	}

	const chapter = await getChapter(params)

	if (!chapter) {
		return redirect("/")
	}

	const requiredFields = [
		chapter.title,
		chapter.videoUrl,
		chapter.description
	]

	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length

	const progress = `(${completedFields} / ${totalFields})`

	const isComplete = requiredFields.every(Boolean)

	return (
		<>
			{!chapter.isPublished && <Banner variant="warning" label="This chapter is not published, It will not be visiable in course" />}
			<div className="p-6">
				<div className="flex justify-between items-center">
					<div className="w-full">
						<Link
							href={`/teacher/courses/${params.courseId}`}
							className="flex items-center text-sm hover:opacity-75 transition mb-6"
						>
							<ArrowLeft className="w-5 h-5 mr-2" />
							Back
						</Link>
						<div className="flex items-center justify-between w-full">
							<div className="text-2xl font-medium">
								<h1 className="text-2xl font-medium">
									Chapter Creation
								</h1>
								<span className="text-sm text-muted-foreground">
									Complete A {progress}
								</span>
							</div>
							<ChapterActions
								disabled={!isComplete}
								chapterId={params.chapterId}
								courseId={params.courseId}
								isPublished={chapter.isPublished}
							/>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
					<div className="space-y-4">
						<div>
							<div className="flex items-center gap-x-2">
								<Badge icon={LayoutDashboard} />
								<h2 className="text-xl">Edit Your Chapter</h2>
							</div>
							<TitleForm 
								initialData={chapter}
								courseId={params.courseId}
								chapterId={params.chapterId} 
							/>
							<DescriptionForm 
								initialData={chapter} 
								courseId={params.courseId}
								chapterId={params.chapterId} 
							/>
						</div>
						<div>
							<div className="flex items-center gap-x-2">
								<Badge icon={Eye} />
								<h2 className="text-xl">Access Settings</h2>
							</div>
							<AccessForm 
								initialData={chapter} 
								courseId={params.courseId}
								chapterId={params.chapterId}
							/>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-x-2">
							<Badge icon={Video} />
							<h2 className="text-xl">Video</h2>
						</div>
						<VideoForm 
							initialData={chapter}
							courseId={params.courseId}
							chapterId={params.chapterId} 
						/>
					</div>
				</div>
			</div>
		</>
	)
}