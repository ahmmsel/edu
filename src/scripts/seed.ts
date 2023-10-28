const { PrismaClient } = require("@prisma/client")

const database = new PrismaClient()

async function main() {
	try {
		await database.category.createMany({
			data: [
				{ name: "Coding" },
				{ name: "Markting" },
				{ name: "Design" },
				{ name: "Math & Scince" }
			]
		})

		console.log("Seeding Successfully!")
	} catch (error) {
		console.log(error)
	} finally {
		await database.$disconnect()
	}
}

main()