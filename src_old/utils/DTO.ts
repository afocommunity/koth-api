/**
 * Data Transfer Object (DTO) class to standardize API responses.
 * Contains the response data and HTTP status code
 */
export class DTO<T> {
	constructor(
		public data: T,
		public status: number = 200,
	) {}
}
