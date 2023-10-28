"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SearchInput } from "./search-input"

export const NavbarLinks = () => {
	const pathname = usePathname()
	const router = useRouter()

	const isTeacher = pathname?.startsWith("/teacher")
	const isStudent = pathname?.includes("/courses")
	const isSearchPage = pathname === "/search"

	return (
		<>
			{isSearchPage && (
				<div className="hidden md:block">
					<SearchInput />
				</div>
			)}
			<div className="flex gap-x-2 ml-auto">
				{isTeacher || isStudent ? (
					<Link href="/">
						<Button size="sm" variant="ghost">
							<LogOut className="w-4 h-4 mr-2" />
							Leave
						</Button>					
					</Link>
				) : (
					<Link href="/teacher/courses">
						<Button size="sm" variant="ghost">
							Teacher Mode
						</Button>
					</Link>
				)}
				<UserButton 
					afterSignOutUrl="/"
				/>
			</div>			
		</>

	)
}