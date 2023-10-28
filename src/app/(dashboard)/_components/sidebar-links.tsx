"use client"

import { usePathname } from "next/navigation"

import { Layout, Compass, List, BarChart } from "lucide-react"
import { SidebarItem } from "./sidebar-item"
import { DEFAULT_CIPHERS } from "tls"

const DEFAULT_LINKS = [
	{
		icon: Layout,
		label: "Dashboard",
		href: "/"
	},
	{
		icon: Compass,
		label: "Browse",
		href: "/search"
	}
]

const TEACHER_LINKS = [
	{
		icon: List,
		label: "Courses",
		href: "/teacher/courses"
	},
	{
		icon: BarChart,
		label: "Analytics",
		href: "/teacher/analytics"
	}
]

export const SidebarLinks = () => {
	const pathname = usePathname()

	const isTeacher = pathname?.includes("/teacher")

	const links = isTeacher ? TEACHER_LINKS : DEFAULT_LINKS

	return (
		<div className="flex flex-col w-full">
			{links.map((link) => (
				<SidebarItem 
					key={link.href}
					label={link.label}
					href={link.href}
					icon={link.icon}
				/>
			))}
		</div>
	)
}