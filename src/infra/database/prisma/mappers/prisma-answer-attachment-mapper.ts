import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Prisma, Attachment as PrismaAnswerAttachment } from '@prisma/client'

export class PrismaAnswerAttachmentMapper {
	static toDomain(raw: PrismaAnswerAttachment): AnswerAttachment {
		if (!raw.answerId) {
			throw new Error('Invalid attachment type.')
		}

		return AnswerAttachment.create(
			{
				attachmentId: new UniqueEntityId(raw.id),
				answerId: new UniqueEntityId(raw.answerId),
			},
			new UniqueEntityId(raw.id)
		)
	}

	static toPrismaUpdateMany(
		attachments: AnswerAttachment[]
	): Prisma.AttachmentUpdateManyArgs {
		const attachmentsIds = attachments.map(attachment => {
			return attachment.attachmentId.toString()
		})

		return {
			where: {
				id: {
					in: attachmentsIds,
				},
			},
			data: {
				answerId: attachments[0].answerId.toString(),
			},
		}
	}
}
