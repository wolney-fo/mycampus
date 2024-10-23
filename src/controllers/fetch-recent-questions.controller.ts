import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthModule } from 'src/auth/auth.module'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

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
	constructor(private prisma: PrismaService) {}

	@Get()
	async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
		const itemsPerPage = 20

		const questions = await this.prisma.question.findMany({
			take: itemsPerPage,
			skip: (page - 1) * itemsPerPage,
			orderBy: {
				createdAt: 'desc',
			},
		})

		return { questions }
	}
}
