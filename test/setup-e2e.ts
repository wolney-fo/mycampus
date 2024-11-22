import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { DomainEvents } from '@/core/events/domain-events'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error('Database URL not provided.')
	}

	const url = new URL(process.env.DATABASE_URL)

	url.searchParams.set('schema', schemaId)

	return url.toString()
}

const schemaID = randomUUID()

beforeAll(async () => {
	const databaseURL = generateUniqueDatabaseURL(schemaID)

	process.env.DATABASE_URL = databaseURL

	DomainEvents.shouldRun = false

	execSync('yarn prisma migrate deploy')
})

afterAll(async () => {
	await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaID}" CASCADE`)
	await prisma.$disconnect()
})
