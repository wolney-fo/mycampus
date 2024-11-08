import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateAttachmentUseCaseRequest {
	fileName: string
	fileType: string
	body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
	InvalidAttachmentTypeError,
	{
		attachment: Attachment
	}
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
	constructor(
		private uploader: Uploader,
		private attachmentsRepository: AttachmentsRepository
	) {}

	async execute({
		fileName,
		fileType,
		body,
	}: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
		if (!/^(image\/(png|jpeg|jpg))$|^application\/pdf$/.test(fileType)) {
			return left(new InvalidAttachmentTypeError(fileType))
		}

		const { url } = await this.uploader.upload({ fileName, fileType, body })

		const attachment = Attachment.create({
			title: fileName,
			url: 'https://wolney.dev',
		})

		await this.attachmentsRepository.create(attachment)

		return right({
			attachment,
		})
	}
}
