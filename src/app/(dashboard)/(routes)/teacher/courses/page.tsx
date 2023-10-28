import Link from "next/link"

import { Button } from "@/components/ui/button";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getTeacherCourses } from "@/actions/get-teacher-courses";

async function getData(): Promise<any[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}

export default async function CoursesPage() {
	const data = await getTeacherCourses()

	return (
		<div className="p-6">
			<DataTable columns={columns} data={data} />
		</div>
	)
}