export class InvalidAttachmentTypeError extends Error {
	constructor(type: string) {
		super(`Type ${type} is not valid.`)
	}
}
