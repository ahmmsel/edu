import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import { getDashboardCourses } from '@/actions/get-dashboard-courses'
import { CoursesList } from '@/components/common/ courses-list'
import { InfoCard } from './_components/info-card'
import { CheckCircle, Clock } from 'lucide-react'


export default async function Dashboard() {
  const { userId } = auth()

  if (!userId) {
    return redirect("/")
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId)

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard 
          label="In Progress"
          icon={Clock}
          count={coursesInProgress.length}
        />
        <InfoCard 
          label="Completed Courses"
          icon={CheckCircle}
          count={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  )
}
