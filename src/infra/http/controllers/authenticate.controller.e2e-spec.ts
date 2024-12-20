import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleRef.createNestApplication()

		prisma = moduleRef.get(PrismaService)

		await app.init()
	})

	test('[POST] /sessions', async () => {
		await prisma.user.create({
			data: {
				name: 'John Doe',
				email: 'john@example.com',
				password: await hash('12345678', 8),
			},
		})

		const response = await request(app.getHttpServer()).post('/sessions').send({
			email: 'john@example.com',
			password: '12345678',
		})

		expect(response.statusCode).toBe(201)
		expect(response.body).toEqual({
			data: { access_token: expect.any(String) },
		})
	})
})
