import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateOrganizationDto {
	@ApiProperty({
		description: 'Organization name',
		example: 'My Gaming Community',
		minLength: 1,
		maxLength: 255,
	})
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	name: string;
}
