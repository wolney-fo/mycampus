import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and create attachment use case', () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
		fakeUploader = new FakeUploader()
		sut = new UploadAndCreateAttachmentUseCase(
			fakeUploader,
			inMemoryAttachmentsRepository
		)
	})

	it('should be able to create and upload an attachment', async () => {
		const result = await sut.execute({
			fileName: 'mycampus.png',
			fileType: 'image/png',
			body: Buffer.from(''),
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			attachment: inMemoryAttachmentsRepository.items[0],
		})
		expect(fakeUploader.uploads).toHaveLength(1)
		expect(fakeUploader.uploads[0]).toEqual(
			expect.objectContaining({
				fileName: 'mycampus.png',
			})
		)
	})

	it('should not be able to upload an attachment with invalid file type', async () => {
		const result = await sut.execute({
			fileName: 'mycampus.mp3',
			fileType: 'audio/mp3',
			body: Buffer.from(''),
		})

		expect(result.isLeft()).toBe(true)
		expect(fakeUploader.uploads).toHaveLength(0)
		expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
	})
})
