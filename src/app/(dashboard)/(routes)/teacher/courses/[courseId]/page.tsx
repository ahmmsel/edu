import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react"

import { getCourseById } from "@/actions/get-course-by-id"
import { getCategories } from "@/actions/get-categories"
import { Badge } from "@/components/common/badge"
import { TitleForm } from "./_components/title-form"
import { DescriptionForm } from "./_components/description-form"
import { ImageForm } from "./_components/image-form"
import { CategoryForm } from "./_components/category-form"
import { useMemo } from "react"
import { PriceForm } from "./_components/price-form"
import { AttachmentForm } from "./_components/attachment-form"
import { ChaptersForm } from "./_components/chapters-form"
import { Banner } from "@/components/common/banner"
import { Actions } from "./_components/actions"

export default async function CourseIdPage({
	params
}: {
	params: { courseId: string }
}) {
	const { userId } = auth()

	// Get Course By Id
	const course = await getCourseById(params.courseId)
	// Get Categories
	const categories = await getCategories()
	// Format Categories To { label, value }
	const formatedCategories = categories.map((category => ({ label: category.name, value: category.id })))

	if (!course || !userId) {
		return redirect("/")
	}

	const requiredFields = [
		course.title,
		course.description,
		course.imageUrl,
		course.price,
		course.categoryId,
		course.chapters.some((chapter) => chapter.isPublished)
	]

	const totalFields = requiredFields.length
	const completedFields = requiredFields.filter(Boolean).length
	const progress = `${completedFields} / ${totalFields}`

	return (
		<>
			{!course.published && (
				<Banner 
					variant="warning"
					label="This course is not published!"
				/>
			)}
			<div className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-y-2">
						<h1 className="text-2xl font-semibold">Setup Completion</h1>
						<span className="text-muted-foreground text-base capitalize">complete a ({progress})</span>
					</div>
					<Actions 
						disabled={!completedFields}
						courseId={params.courseId}
						isPublished={course.published}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
					<div>
						<div className="flex items-center gap-x-2">
						  <Badge icon={LayoutDashboard} />
							<h2 className="text-xl">
								Edit Your Course.
							</h2>
						</div>
						<TitleForm initialData={course} courseId={course.id} />
						<DescriptionForm initialData={course} courseId={course.id} />
						<ImageForm initialData={course} courseId={course.id} />
						<CategoryForm initialData={course} courseId={course.id} optionsList={formatedCategories} />
					</div>
					<div className="space-y-6">
						<div>
							<div className="flex items-center gap-x-2 ">
								<Badge icon={ListChecks} />
								<h2 className="text-xl">Course Sections.</h2>
							</div>
							<ChaptersForm initialData={course} courseId={course.id} />
						</div>
						<div>
							<div className="flex items-center gap-x-2">
								<Badge icon={CircleDollarSign} />
								<h2 className="text-xl">Course Price.</h2>
							</div>
							<PriceForm initialData={course} courseId={course.id} />
						</div>
						<div>
							<div className="flex items-center gap-x-2">
								<Badge icon={File} />
								<h2 className="text-xl">Attachments.</h2>
							</div>
							<AttachmentForm initialData={course} courseId={course.id} />
						</div>
					</div>
				</div>
			</div>			
		</>

	)
}