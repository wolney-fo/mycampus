import {
	Body,
	Controller,
	HttpCode,
	Post,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'
import { compare } from 'bcryptjs'

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
	constructor(
		private jwt: JwtService,
		private prisma: PrismaService
	) {}

	@Post()
	@HttpCode(200)
	async handle(@Body() body: AuthenticateBodySchema) {
		const { email, password } = body

		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		})

		if (!user) {
			throw new UnauthorizedException('Invalid credentials.')
		}

		const isPasswordCorrect = await compare(password, user.password)

		if (!isPasswordCorrect) {
			throw new UnauthorizedException('Invalid credentials.')
		}

		const accessToken = this.jwt.sign({ sub: user.id })

		return { data: { access_token: accessToken } }
	}
}
