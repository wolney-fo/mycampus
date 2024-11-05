import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param, Put
} from '@nestjs/common'
import { z } from 'zod'

const editQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
})

export type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)

@Controller('/questions/:id')
export class EditQuestionController {
	constructor(private editQuestion: EditQuestionUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@Body(bodyValidationPipe) body: EditQuestionBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('id') questionId: string
	) {
		const { title, content } = body
		const { sub: userId } = user

		const result = await this.editQuestion.execute({
			questionId,
			title,
			content,
			authorId: userId,
			attachmentsIds: [],
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
