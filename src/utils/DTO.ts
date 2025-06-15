export class DTO<T> {
	constructor(
		public data: T,
		public status: number = 200,
	) {}
}
