import { BaseError } from './BaseError';

export class DataNotFoundError extends BaseError {
	constructor(error: string) {
		super('data_not_found', error);
	}
}
