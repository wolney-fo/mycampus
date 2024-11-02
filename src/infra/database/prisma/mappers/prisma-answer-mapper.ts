import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Prisma, Answer as PrismaAnswer } from '@prisma/client'

export class PrismaAnswerMapper {
	static toDomain(raw: PrismaAnswer): Answer {
		return Answer.create(
			{
        content: raw.content,
				authorId: new UniqueEntityId(raw.authorId),
				questionId: new UniqueEntityId(raw.questionId),
				createdAt: raw.createdAt,
				updatedAt: raw.createdAt,
			},
			new UniqueEntityId(raw.id)
		)
	}

	static toPrisma(raw: Answer): Prisma.AnswerUncheckedCreateInput {
		return {
			id: raw.id.toString(),
			content: raw.content,
			authorId: raw.authorId.toString(),
			questionId: raw.questionId.toString(),
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
		}
	}
}
