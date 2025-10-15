import { ApiToken } from '@/models/api-token.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { InferAttributes, Op, WhereOptions } from 'sequelize';
import { createId } from '@/utils/createId';
import { CreateApiTokenDto } from './dtos/create-api-token.dto';

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

	async createApiToken(createApiTokenDto: CreateApiTokenDto) {
		const tokenId = createId();
		return this.apiTokenModel.create({
			id: tokenId,
			...createApiTokenDto,
		});
	}

	async findAllApiTokens(org_id?: string, server_id?: string) {
		const where: WhereOptions<InferAttributes<ApiToken>> = {};
		if (org_id) where.org_id = org_id;
		if (server_id) where.server_id = server_id;

		return this.apiTokenModel.findAll({
			where,
			order: [['expiresAt', 'DESC']],
		});
	}

	async revokeApiToken(id: string) {
		const token = await this.apiTokenModel.findByPk(id);
		if (!token) {
			throw new NotFoundException(`API Token with ID ${id} not found`);
		}
		await token.destroy();
		return { message: 'API Token revoked successfully' };
	}
}
