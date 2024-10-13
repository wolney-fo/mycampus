import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { PrismaService } from './prisma/prisma.service'

@Controller()
export class AppController {
	constructor(
		private appService: AppService,
		private prisma: PrismaService
	) {}

	@Get()
	async getHello() {
		return this.prisma.user.findFirst()
	}
}
