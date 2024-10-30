import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register student use case', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		fakeHasher = new FakeHasher()

		sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
	})

	it('should be able to register a student', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			email: 'hey@john.com',
			password: '12345678',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			student: inMemoryStudentsRepository.items[0],
		})
	})

	it('should hash student password upon registration', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			email: 'hey@john.com',
			password: '12345678',
		})

		const passwordHash = await fakeHasher.hash('12345678')

		expect(result.isRight()).toBe(true)
		expect(inMemoryStudentsRepository.items[0].password).toEqual(passwordHash)
	})
})
