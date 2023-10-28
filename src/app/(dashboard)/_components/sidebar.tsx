"use client"

import { Logo } from "@/components/logo/default"
import { SidebarLinks } from "./sidebar-links"

export const Sidebar = () => {
	return (
		<div className="bg-white border-r shadow-sm flex flex-col overflow-y-auto h-full w-full md:w-60">
			<div className="p-6">
				<Logo />
			</div>
			<div className="flex flex-col w-full">
				<SidebarLinks />
			</div>
		</div>
	)
}