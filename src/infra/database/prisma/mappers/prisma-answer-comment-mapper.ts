import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Prisma, Comment as PrismaAnswerComment } from '@prisma/client'

export class PrismaAnswerCommentMapper {
	static toDomain(raw: PrismaAnswerComment): AnswerComment {
		if (!raw.answerId) {
			throw new Error('Invalid comment type.')
		}

		return AnswerComment.create(
			{
				content: raw.content,
				authorId: new UniqueEntityId(raw.authorId),
				answerId: new UniqueEntityId(raw.answerId),
				createdAt: raw.createdAt,
				updatedAt: raw.createdAt,
			},
			new UniqueEntityId(raw.id)
		)
	}

	static toPrisma(raw: AnswerComment): Prisma.CommentUncheckedCreateInput {
		return {
			id: raw.id.toString(),
			content: raw.content,
			authorId: raw.authorId.toString(),
			answerId: raw.answerId.toString(),
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
		}
	}
}
