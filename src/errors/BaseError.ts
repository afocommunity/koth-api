/* eslint-disable @typescript-eslint/no-explicit-any */
const kCode = Symbol.for('kCode');

/**
 * Base Error
 *
 * @example
 * export class InvalidPermissionError extends BaseError {
 *   constructor() {
 *     super('INVALID_PERMISSION', 'The user does not have high enough permissions');
 *     this.raiseTrace(1);
 *   }
 * }
 */
export class BaseError extends Error {
	public readonly [kCode]: string;
	constructor(type: string, error?: any) {
		super(error);
		this[kCode] = type;
		if (Error.captureStackTrace != null) {
			Error.captureStackTrace(this, BaseError);
		}
		this.raiseTrace();
	}

	public get name() {
		return `[${this[kCode]}]`;
	}

	public get code() {
		return this[kCode];
	}

	public get message() {
		return super.message ?? 'No Message';
	}

	public raiseTrace(amount = 1) {
		this.stack = this.stack
			?.split('\n')
			.filter((_, index) => !(index > 0 && index <= amount))
			?.join('\n');
		return this;
	}
}
