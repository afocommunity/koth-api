import { IsOptional, IsEnum, IsString } from 'class-validator';

export class GetPlayerQueryDto {
	@IsOptional()
	@IsString()
	include: string = 'native';

	@IsOptional()
	@IsEnum(['native', 'steam', 'eos'], {
		message: 'by must be one of: native, steam, eos',
	})
	by: string = 'native';
}
