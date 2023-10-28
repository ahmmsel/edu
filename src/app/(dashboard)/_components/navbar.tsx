"use client"

import { NavbarLinks } from "@/components/common/navbar-links"
import { MobileSidebar } from "./mobile-sidebar"

export const Navbar = () => {
	return (
		<div className="h-full bg-white shadow-sm p-4 border-b flex items-center">
			<MobileSidebar />
			<NavbarLinks />
		</div>
	)
}