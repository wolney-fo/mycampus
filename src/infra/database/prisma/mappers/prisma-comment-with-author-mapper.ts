import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client'

type PrismaCommentWithAuthor = PrismaComment & {
	author: PrismaUser
}

export class PrismaCommentWithAuthorMapper {
	static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
		return CommentWithAuthor.create({
			commentId: new UniqueEntityId(raw.id),
			commentContent: raw.content,
			authorId: new UniqueEntityId(raw.authorId),
			authorName: raw.author.name,
			createdAt: raw.createdAt,
			updatedAt: raw.createdAt,
		})
	}
}
