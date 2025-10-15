import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException('JWT token is required');
		}

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: process.env.AUTH_SECRET,
			});
			request['user'] = payload;
		} catch {
			throw new UnauthorizedException('Invalid or expired JWT token');
		}

		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const authHeader = request.headers.authorization;
		if (!authHeader) {
			return undefined;
		}

		const [type, token] = authHeader.split(' ');
		return type === 'Bearer' ? token : undefined;
	}
}
