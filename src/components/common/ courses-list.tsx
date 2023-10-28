"use client"

import { Category, Course } from "@prisma/client";
import { CourseItem } from "./course-item";

type CourseInformation = Course & {
	category: Category | null;
	progress: number | null;
	chapters: { id: string }[]
}

interface CoursesListProps {
	items: CourseInformation[]
}

export const CoursesList = ({ items }: CoursesListProps) => {
	return (
		<div>
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{items.map((item) => (
					<CourseItem 
						key={item.id}
						id={item.id}
						title={item.title}
						chaptersCount={item.chapters.length}
						imageUrl={item.imageUrl!}
						price={item.price!}
						progress={item.progress}
						category={item?.category?.name!}
					/>
				))}
			</div>	
			{items.length === 0 && (
				<div className="text-muted-foreground text-center font-medium mt-12">
					No Courses.
				</div>
			)}		
		</div>

	)
}