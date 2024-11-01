import { InvalidCredentialsError } from '@/core/errors/errors/invalid-credentials-error'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { Public } from '@/infra/auth/public'
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
	UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
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
			const error = result.value

			switch (error.constructor) {
				case InvalidCredentialsError:
					throw new UnauthorizedException(error.message)
				default:
					throw new BadRequestException()
			}
		}

		const { accessToken } = result.value

		return { data: { access_token: accessToken } }
	}
}
