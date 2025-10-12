import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { ApiToken } from '@/models/api-token.model';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ApiTokenGuard implements CanActivate {
	constructor(
		@InjectModel(ApiToken)
		private readonly apiTokenModel: typeof ApiToken,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request | Socket>();
		const isSocket = request instanceof Socket;
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new (isSocket ? WsException : UnauthorizedException)(
				'API token is required',
			);
		}

		const apiToken = await this.apiTokenModel.findByPk(token);

		if (!apiToken) {
			throw new (isSocket ? WsException : UnauthorizedException)(
				'Invalid API token',
			);
		}

		// Check if token has expired
		if (apiToken.expiresAt && new Date(apiToken.expiresAt) < new Date()) {
			throw new (isSocket ? WsException : UnauthorizedException)(
				'API token has expired',
			);
		}

		// Attach token data to request for potential use in controllers
		request['apiToken'] = apiToken;

		return true;
	}

	private extractTokenFromHeader(
		request: Request | Socket,
	): string | undefined {
		const authHeader =
			(request as Socket)?.handshake?.headers?.authorization ??
			(request as Request)?.headers?.authorization;
		if (!authHeader) {
			return undefined;
		}

		const [type, token] = authHeader.split(' ');
		return type === 'Bearer' ? token : undefined;
	}
}
