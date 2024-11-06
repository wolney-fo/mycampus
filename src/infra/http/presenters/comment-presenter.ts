import { Comment } from '@/domain/forum/enterprise/entities/comment'

export class CommentPresenter {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	static toHTTP(questionComment: Comment<any>) {
		return {
			id: questionComment.id.toString(),
			content: questionComment.content,
			createdAt: questionComment.createdAt,
			updatedAt: questionComment.updatedAt,
		}
	}
}
