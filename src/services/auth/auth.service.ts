import { ApiToken } from '@/models/api-token.model';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		@InjectModel(ApiToken) private readonly apiTokenModel: typeof ApiToken,
	) {}

	@Cron('0 30 * * * *', { name: 'destroy_expired_tokens' })
	async destroyExpiredTokens() {
		const now = Date.now();
		// const expiringTokens = await this.apiTokenModel.findAll({
		//   where: {
		//     expiresAt: {
		//       [Op.gte]: now,
		//     },
		//   },
		// });
		// for (const _token of expiringTokens) {
		//   //TODO Alert?
		// }
		return await this.apiTokenModel.destroy({
			where: { expiresAt: { [Op.gte]: now } },
		});
	}
}
