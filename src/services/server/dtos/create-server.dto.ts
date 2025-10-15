import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateServerDto {
	@ApiProperty({
		description: 'Organization ID this server belongs to',
		example: '01hp3r7xzq9m8n7w6v5t4s3r2p',
	})
	@IsString()
	org_id: string;

	@ApiProperty({
		description: 'Server name',
		example: 'US West Server 1',
		minLength: 1,
		maxLength: 255,
	})
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	name: string;
}
