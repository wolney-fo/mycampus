import { Comment } from '@/domain/forum/enterprise/entities/comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
	static toHTTP(commentWithAuthor: CommentWithAuthor) {
		return {
			commentId: commentWithAuthor.commentId.toString(),
			commentContent: commentWithAuthor.commentContent,
			authorId: commentWithAuthor.authorId.toString(),
			authorName: commentWithAuthor.authorName,
			createdAt: commentWithAuthor.createdAt,
			updatedAt: commentWithAuthor.updatedAt,
		}
	}
}
