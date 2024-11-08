import { Attachment } from '../../enterprise/entities/attachment'

export abstract class AttachmentsRepository {
	abstract create(attachments: Attachment): Promise<void>
}
