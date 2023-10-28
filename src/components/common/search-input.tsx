"use client"

import qs from "query-string"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

export const SearchInput = () => {
	const [value, setValue] = useState("")
	const debouncedValue = useDebounce(value)

	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const currentCategoryId = searchParams.get("categoryId")

	useEffect(() => {
		const url = qs.stringifyUrl({
			url: pathname,
			query: {
				categoryId: currentCategoryId,
				title: debouncedValue
			}
		}, {
			skipNull: true,
			skipEmptyString: true
		})

		router.push(url)
	}, [debouncedValue, currentCategoryId, pathname, router])

	return (
		<div className="relative">
			<Search 
				className="w-4 h-4 absolute top-3 left-3 text-slate-600"
			/>
			<Input 
				onChange={(e) => setValue(e.target.value)}
				value={value}
				className="w-full md:w-[300px] pl-9 rounded-md bg-slate-100 focus-visible:ring-slate-200"
				placeholder="Search For Course."
			/>
		</div>
	)
}