import { IsOptional, IsEnum, IsString, isArray } from 'class-validator';

export class GetPlayerQueryDto {
	@IsOptional()
	@IsString({ each: true })
	include?: string | string[];

	@IsOptional()
	@IsEnum(['native', 'steam', 'eos'], {
		message: 'by must be one of: native, steam, eos',
	})
	by: 'native' | 'steam' | 'eos';
}
