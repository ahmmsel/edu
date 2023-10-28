"use client"

import qs from "query-string"
import { cn } from "@/lib/utils";

import { LucideIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CategoryItem {
	label: string;
	value: string;
	icon: LucideIcon;
}

export const CategoryItem = ({
	label,
	value,
	icon: Icon,
}: CategoryItem) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const currentCategoryId = searchParams.get("categoryId")
	const currentTitle = searchParams.get("title")

	const categoryIsSelected = currentCategoryId === value

	const handleClick = () => {
		const url = qs.stringifyUrl({
			url: pathname,
			query: {
				title: currentTitle,
				categoryId: categoryIsSelected ? null : value
			}
		}, {
			skipNull: true,
			skipEmptyString: true
		})

		router.push(url)
	}

	return (
		<button onClick={handleClick} className={cn(
			"py-2 px-3 border rounded-full flex items-center gap-x-1 transition hover:bg-sky-200/50 hover:text-sky-800",
			categoryIsSelected && "bg-sky-200/50 text-sky-800"
		)}>
			<Icon className="w-4 h-4" />
			<div className="truncate">
				{label}
			</div>
		</button>
	)
}