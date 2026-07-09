import prisma from "../lib/prisma.js"
import users from "./seed-data/users.json" with { type: 'json' }

async function main() {
    try {
        await prisma.user.createMany({ data: users })
    } catch (error) {
        console.error("Error seeding database:", error)
    }
    await prisma.$disconnect()
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())