import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
} from '@nestjs/common'
import { z } from 'zod'
import { CommentPresenter } from '../presenters/comment-presenter'

const pageQueryParamSchema = z
	.string()
	.optional()
	.default('1')
	.transform(Number)
	.pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
	constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

	@Get()
	async handle(
		@Query('page', queryValidationPipe) page: PageQueryParamSchema,
		@Param('answerId') answerId: string
	) {
		const result = await this.fetchAnswerComments.execute({
			answerId,
			page,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}

		const { answerComments } = result.value

		return { comments: answerComments.map(CommentPresenter.toHTTP) }
	}
}
