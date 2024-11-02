import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Prisma, Comment as PrismaQuestionComment } from '@prisma/client'

export class PrismaQuestionCommentMapper {
	static toDomain(raw: PrismaQuestionComment): QuestionComment {
		if (!raw.questionId) {
			throw new Error('Invalid comment type.')
		}

		return QuestionComment.create(
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

	static toPrisma(raw: QuestionComment): Prisma.CommentUncheckedCreateInput {
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
