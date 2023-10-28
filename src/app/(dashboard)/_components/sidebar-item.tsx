"use client"

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation"

export const SidebarItem = ({
	label,
	href,
	icon: Icon
}: {
	label: string;
	href: string;
	icon: LucideIcon
}) => {
	const pathname = usePathname()
	const router = useRouter()

	const isActive = 
		(pathname === "/" && href === "/") ||
		pathname === href ||
		pathname?.startsWith(`${href}/`)

	const handleClick = () => {
		router.push(href)
	}

	return (
		<button
			onClick={handleClick}
			type="button"
			className={cn("flex items-center gap-x-2 text-sm text-slate-500 font-medium pl-5 transition-all hover:text-slate-600 hover:bg-slate-300/20 ", isActive && "text-sky-700 bg-sky-200/20 hover:text-sky-700 hover:bg-slate-200/20")}
		>
			<div className="flex items-center gap-x-2 py-2">
				<Icon 
					size={22}
					className={cn(
						"text-slate-500",
						isActive && "text-sky-700"
					)}
				/>
				{label}
			</div>
			<div 
				className={cn(
					"ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
					isActive && "opacity-100"
				)}
			/>
		</button>
	)
}