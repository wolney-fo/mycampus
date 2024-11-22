import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
	static toHTTP(questionDetails: QuestionDetails) {
		return {
			questionId: questionDetails.questionId.toString(),
			title: questionDetails.questionTitle,
			slug: questionDetails.questionSlug,
			content: questionDetails.questionContent,
			attachments: questionDetails.questionAttachments.map(
				AttachmentPresenter.toHTTP
			),
			bestAnswerId: questionDetails.bestAnswerId?.toString(),
			authorId: questionDetails.authorId.toString(),
			authorName: questionDetails.authorName,
			createdAt: questionDetails.createdAt,
			updatedAt: questionDetails.updatedAt,
		}
	}
}
