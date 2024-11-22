import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Post,
} from '@nestjs/common'
import { z } from 'zod'

const answerQuestionBodySchema = z.object({
	content: z.string(),
	attachments: z.array(z.string().uuid()),
})

export type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
	constructor(private answerQuestion: AnswerQuestionUseCase) {}

	@Post()
	@HttpCode(201)
	async handle(
		@Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('questionId') questionId: string
	) {
		const { content, attachments } = body
		const { sub: userId } = user

		const result = await this.answerQuestion.execute({
			questionId,
			content,
			authorId: userId,
			attachmentsIds: attachments,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
