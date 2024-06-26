import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { getCategories } from "@/actions/get-categories"
import { Categories } from "./_components/categories"
import { SearchInput } from "@/components/common/search-input"
import { getCourses } from "@/actions/get-courses"
import { CoursesList } from "@/components/common/ courses-list"

interface SearchPageProps {
	searchParams: {
		title: string;
		categoryId: string;
	}
}

export default async function SearchPage({
	searchParams
}: SearchPageProps) {
	const { userId } = auth()

	if (!userId) return redirect("/")

	const categories = await getCategories()

	const courses = await getCourses({
		userId,
		...searchParams
	})

	return (
		<>
			<div className="px-6 pt-6 md:hidden md:mb-0 block">
				<SearchInput />
			</div>
			<div className="p-6 space-y-6">
				<Categories 
					items={categories}
				/>
				<CoursesList items={courses} />
			</div>
		</>
	)
}