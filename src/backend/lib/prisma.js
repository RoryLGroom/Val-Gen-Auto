import dotenv from "dotenv"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client.ts"

dotenv.config({ path: ".env.local" }) // ensure environment variables are loaded into process.env

const adapter = new PrismaPg({
    connectionString: process.env.POSTGRES_URL
})
const prisma = new PrismaClient({ adapter })

export default prisma