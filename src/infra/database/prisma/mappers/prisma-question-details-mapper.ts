import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import {
	Question as PrismaQuestion,
	User as PrismaUser,
	Attachment as PrismaAttachment,
} from '@prisma/client'
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

type PrismaQuestionDetails = PrismaQuestion & {
	author: PrismaUser
	attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
	static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
		return QuestionDetails.create({
			questionId: new UniqueEntityId(raw.id),
			questionContent: raw.content,
			questionTitle: raw.title,
			questionSlug: Slug.create(raw.slug),
			questionAttachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
			bestAnswerId: raw.bestAnswerId
				? new UniqueEntityId(raw.bestAnswerId)
				: null,
			authorId: new UniqueEntityId(raw.authorId),
			authorName: raw.author.name,
			createdAt: raw.createdAt,
			updatedAt: raw.createdAt,
		})
	}
}
