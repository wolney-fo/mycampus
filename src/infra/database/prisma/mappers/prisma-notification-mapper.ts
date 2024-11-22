import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Prisma, Notification as PrismaNotification } from '@prisma/client'

export class PrismaNotificationMapper {
	static toDomain(raw: PrismaNotification): Notification {
		return Notification.create(
			{
				title: raw.title,
				content: raw.content,
				recipientId: new UniqueEntityId(raw.recipientId),
				createdAt: raw.createdAt,
				readAt: raw.readAt,
			},
			new UniqueEntityId(raw.id)
		)
	}

	static toPrisma(raw: Notification): Prisma.NotificationUncheckedCreateInput {
		return {
			id: raw.id.toString(),
			title: raw.title,
			content: raw.content,
			recipientId: raw.recipientId.toString(),
			createdAt: raw.createdAt,
			readAt: raw.readAt,
		}
	}
}
