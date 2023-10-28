import { Navbar } from "./_components/navbar"
import { Sidebar } from "./_components/sidebar"

export default function DashboardLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<div className="h-full">
			{/* Navbar */}
		  <div className="md:pl-60 w-full h-[80px] fixed inset-y-0 z-50">
		  	<Navbar />
		  </div>
			{/* Sidebar */}
			<div className="hidden md:flex flex-col fixed z-56 inset-y-0 h-full w-60">
				<Sidebar />
			</div>
			{/* Main Content */}
			<main className="md:pl-60 pt-[80px] h-full">
				{children}
			</main>
		</div>
	)
}