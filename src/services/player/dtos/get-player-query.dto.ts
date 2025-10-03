import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

export class GetPlayerQueryDto {
	@ApiProperty({
		enum: ['savefile'],
		isArray: true,
		description: 'Related entities to include in the response',
		required: false,
	})
	@IsOptional()
	@IsEnum(['savefile'], {
		message: 'by must be one of: savefile',
		each: true,
	})
	include?: string | string[];

	@ApiProperty({
		enum: ['native', 'steam', 'eos'],
		description: 'The type of ID provided',
		default: 'native',
		required: false,
	})
	@IsOptional()
	@IsEnum(['native', 'steam', 'eos'], {
		message: 'by must be one of: native, steam, eos',
	})
	by: 'native' | 'steam' | 'eos';
}
