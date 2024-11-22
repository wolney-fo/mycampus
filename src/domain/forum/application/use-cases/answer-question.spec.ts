import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { describe, it } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Question Use Case', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		)
		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
	})

	it('should be able to create an answer', async () => {
		const result = await sut.execute({
			authorId: '1',
			questionId: '1',
			content: 'New answer.',
			attachmentsIds: ['1', '2'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)

		expect(
			inMemoryAnswersRepository.items[0].attachments.currentItems
		).toHaveLength(2)
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
			[
				expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
				expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
			]
		)
	})

	it('should persist attachments when create a new answer', async () => {
		const result = await sut.execute({
			questionId: '1',
			authorId: '1',
			content: 'Answer content',
			attachmentsIds: ['1', '2'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2)
		expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId: new UniqueEntityId('1'),
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityId('2'),
				}),
			])
		)
	})
})
