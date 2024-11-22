import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'
import {
	SendNotificationUseCase,
	SendNotificationUseCaseRequest,
	SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
	(
		request: SendNotificationUseCaseRequest
	) => Promise<SendNotificationUseCaseResponse>
>

describe('On Question Best Answer Chosen', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository
		)

		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		)

		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
		sendNotificationUseCase = new SendNotificationUseCase(
			inMemoryNotificationsRepository
		)

		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

		new OnQuestionBestAnswerChosen(
			inMemoryAnswersRepository,
			sendNotificationUseCase
		)
	})

	it('should send a notification when an answer is chosen as the best one for a question', async () => {
		const question = makeQuestion()
		const answer = makeAnswer({ questionId: question.id })

		inMemoryQuestionsRepository.create(question)
		inMemoryAnswersRepository.create(answer)

		question.bestAnswerId = answer.id

		inMemoryQuestionsRepository.save(question)

		await waitFor(() => {
			expect(sendNotificationExecuteSpy).toHaveBeenCalled()
		})
	})
})
