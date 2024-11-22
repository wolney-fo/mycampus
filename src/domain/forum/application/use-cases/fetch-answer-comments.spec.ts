import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { describe, it } from 'vitest'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments Use Case', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
			inMemoryStudentsRepository
		)
		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
	})

	it('should be able to fetch answer comments', async () => {
		const student = makeStudent({ name: 'John Doe' })

		inMemoryStudentsRepository.items.push(student)

		const comment1 = makeAnswerComment({
			answerId: new UniqueEntityId('answer-1'),
			authorId: student.id,
		})
		const comment2 = makeAnswerComment({
			answerId: new UniqueEntityId('answer-1'),
			authorId: student.id,
		})
		const comment3 = makeAnswerComment({
			answerId: new UniqueEntityId('answer-1'),
			authorId: student.id,
		})

		await inMemoryAnswerCommentsRepository.create(comment1)
		await inMemoryAnswerCommentsRepository.create(comment2)
		await inMemoryAnswerCommentsRepository.create(comment3)

		const result = await sut.execute({
			answerId: 'answer-1',
			page: 1,
		})

		expect(result.value?.comments).toHaveLength(3)
		expect(result.value?.comments).toEqual(
			expect.objectContaining([
				expect.objectContaining({
					commentId: comment1.id,
					authorName: 'John Doe',
				}),
				expect.objectContaining({
					commentId: comment2.id,
					authorName: 'John Doe',
				}),
				expect.objectContaining({
					commentId: comment3.id,
					authorName: 'John Doe',
				}),
			])
		)
	})

	it('should be able to fetch paginated answer comments', async () => {
		const student = makeStudent({ name: 'John Doe' })

		inMemoryStudentsRepository.items.push(student)

		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({
					answerId: new UniqueEntityId('answer-1'),
					authorId: student.id,
				})
			)
		}

		const result = await sut.execute({
			answerId: 'answer-1',
			page: 2,
		})

		expect(result.value?.comments).toHaveLength(2)
	})
})
