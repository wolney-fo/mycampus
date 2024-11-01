import {
	Body,
	Controller,
	HttpCode,
	Post,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'
import { compare } from 'bcryptjs'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
	constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

	@Post()
	@HttpCode(201)
	async handle(@Body() body: AuthenticateBodySchema) {
		const { email, password } = body

		const result = await this.authenticateStudent.execute({
			email,
			password,
		})

		if (result.isLeft()) {
			throw new Error()
		}

		const { accessToken } = result.value

		return { data: { access_token: accessToken } }
	}
}
