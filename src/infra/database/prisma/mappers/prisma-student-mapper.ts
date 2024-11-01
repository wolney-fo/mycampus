import { Student } from '@/domain/forum/enterprise/entities/student'
import { Prisma, User as PrismaStudent } from '@prisma/client'

export class PrismaStudentMapper {
	static toDomain(raw: PrismaStudent): Student {
		return Student.create({
			name: raw.name,
			email: raw.email,
			password: raw.password,
		})
	}

	static toPrisma(raw: Student): Prisma.UserUncheckedCreateInput {
		return {
			id: raw.id.toString(),
			name: raw.name,
			email: raw.email,
			password: raw.password,
			role: 'STUDENT',
		}
	}
}
