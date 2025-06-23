import { ApiToken } from '@/models/ApiToken.model';
import { createId } from '@/utils/createId';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ms from 'ms';
import { Op } from 'sequelize';
import { CronController } from './CronController';
export class AuthController {
	public static async setupCron() {
		CronController.addCron(
			'clear_expired_tokens',
			'0 30 * * * *',
			AuthController.destroyExpiredTokens,
		);
	}
	public static async decodeAuthToken(token: string) {
		let decoded!: string | JwtPayload;
		try {
			decoded = jwt.verify(
				token,
				Buffer.from(process.env.AUTH_SECRET, 'base64'),
				{
					algorithms: ['HS512'],
				},
			) as unknown;
		} catch (error) {
			console.error(error);
			return null;
		}
		return decoded;
	}

	public static async createApiToken(
		org_id: string,
		server_id: string,
		expires: `${number}${'d' | 'h' | 's' | 'm' | 'y'}` = '1y',
	) {
		const expiresIn = ms(expires);
		const expiresAt = new Date(Date.now() + expiresIn);
		const jwtid = createId();
		const token = jwt.sign(
			{ org: org_id, srv: server_id },
			Buffer.from(process.env.AUTH_SECRET, 'base64'),
			{ algorithm: 'HS512', expiresIn, jwtid },
		);
		const tokenModel = await ApiToken.create({
			id: jwtid,
			org_id,
			server_id,
			expiresAt,
		});
		return { tokenModel, token };
	}

	public static async invalidateApiToken(token_id: string) {
		const destroyed = await ApiToken.destroy({ where: { id: token_id } });
		return Boolean(destroyed);
	}

	public static async destroyExpiredTokens() {
		const now = Date.now();
		const expiringTokens = await ApiToken.findAll({
			where: { expiresAt: { [Op.gte]: now } },
		});

		for (const _token of expiringTokens) {
			//TODO Alert?
		}
		return await ApiToken.destroy({ where: { expiresAt: { [Op.gte]: now } } });
	}
}
