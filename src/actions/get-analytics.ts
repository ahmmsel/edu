import prisma from "@/lib/prisma"

import { Course, Purchase } from "@prisma/client"

type PurchaseInformation = Purchase & {
	course: Course
}

const groupByCourse = (purchases: PurchaseInformation[]) => {
	const grouped: { [courseTitle: string]: number } = {}

	purchases.forEach((purchase) => {
		const courseTitle = purchase.course.title
		if (!grouped[courseTitle]) {
			grouped[courseTitle] = 0
		}
		grouped[courseTitle] += purchase.course.price!
	})

	return grouped
}

export const getAnalytics = async (userId: string) => {
	try {
		const purchases = await prisma.purchase.findMany({
			where: {
				userId
			},
			include: {
				course: true
			}
		})

		const groupByEarnings = groupByCourse(purchases)
		const data = Object.entries(groupByEarnings).map(([courseTitle, total]) => ({
			name: courseTitle,
			total
		}))
		const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0)
		const totalSales = purchases.length

		return {
			totalRevenue,
			totalSales,
			data
		}
	} catch (error) {
		console.log(error, "GET_ANALYTICS")
		return {
			data: [],
			totalRevenue: 0,
			totalSales: 0
		}
	}
}