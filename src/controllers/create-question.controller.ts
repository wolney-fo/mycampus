import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
})

export type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private prisma: PrismaService) {}

	@Post()
	@HttpCode(201)
	async handle(
		@Body(bodyValidationPipe) body: CreateQuestionBodySchema,
		@CurrentUser() user: UserPayload
	) {
		const { title, content } = body
		const { sub: userId } = user

		const slug = this.convertToSlug(title)

		await this.prisma.question.create({
			data: {
				authorId: userId,
				title,
				content,
				slug,
			},
		})
	}

	private convertToSlug(text: string) {
		const slugText = text
			.normalize('NFKD')
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-')
			.replace(/[^\w-]+/g, '')
			.replace(/_/g, '-')
			.replace(/--+/g, '-')
			.replace(/-$/g, '')

		return slugText
	}
}
