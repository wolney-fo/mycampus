import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Attachment } from '../attachment'
import { Slug } from './slug'

interface QuestionDetailsProps {
	questionId: UniqueEntityId
	questionSlug: Slug
	questionTitle: string
	questionContent: string
	questionAttachments: Attachment[]
	bestAnswerId?: UniqueEntityId | null
	createdAt: Date
	updatedAt?: Date | null
	authorId: UniqueEntityId
	authorName: string
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
	get questionId() {
		return this.props.questionId
	}

	get questionSlug() {
		return this.props.questionSlug
	}

	get questionTitle() {
		return this.props.questionTitle
	}

	get questionContent() {
		return this.props.questionContent
	}

	get questionAttachments() {
		return this.props.questionAttachments
	}

	get bestAnswerId() {
		return this.props.bestAnswerId
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	get authorId() {
		return this.props.authorId
	}

	get authorName() {
		return this.props.authorName
	}

	static create(props: QuestionDetailsProps) {
		return new QuestionDetails(props)
	}
}
