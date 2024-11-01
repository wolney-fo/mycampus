import { Either, left, right } from '@/core/either'
import { InvalidCredentialsError } from '@/core/errors/errors/invalid-credentials-error'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { StudentsRepository } from '../repositories/students-repository'
import { Injectable } from '@nestjs/common'

interface AuthenticateStudentUseCaseRequest {
	email: string
	password: string
}

type AuthenticateStudentUseCaseResponse = Either<
	InvalidCredentialsError,
	{ accessToken: string }
>

@Injectable()
export class AuthenticateStudentUseCase {
	constructor(
		private studentRepository: StudentsRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter
	) {}

	async execute({
		email,
		password,
	}: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
		const student = await this.studentRepository.findByEmail(email)

		if (!student) {
			return left(new InvalidCredentialsError())
		}

		const isPasswordValid = this.hashComparer.compare(
			password,
			student.password
		)

		if (!isPasswordValid) {
			return left(new InvalidCredentialsError())
		}

		const accessToken = await this.encrypter.encrypt({
			sub: student.id.toString(),
		})

		return right({ accessToken })
	}
}
