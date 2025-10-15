import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString } from 'class-validator';

export class CreateApiTokenDto {
	@ApiProperty({
		description: 'Organization ID',
		example: '01hp3r7xzq9m8n7w6v5t4s3r2p',
	})
	@IsString()
	org_id: string;

	@ApiProperty({
		description: 'Server ID',
		example: '01hp3s8yzr0n9o8x7w6v5u4t3s',
	})
	@IsString()
	server_id: string;

	@ApiProperty({
		description: 'Token expiration date (ISO 8601 format)',
		example: '2025-12-31T23:59:59.000Z',
	})
	@IsDateString()
	expiresAt: string;
}
