import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { AuthModule } from '@/infra/auth/auth.module'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { QuestionPresenter } from '../presenters/question-presenter'

const pageQueryParamSchema = z
	.string()
	.optional()
	.default('1')
	.transform(Number)
	.pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('questions')
@UseGuards(AuthModule)
export class FetchRecentQuestionsController {
	constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

	@Get()
	async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
		const result = await this.fetchRecentQuestions.execute({
			page,
		})

		if (result.isLeft()) {
			throw new Error()
		}

		const { questions } = result.value

		return { questions: questions.map(QuestionPresenter.toHTTP) }
	}
}
