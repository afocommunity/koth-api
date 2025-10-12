import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpsertPlayerDto } from './upsert-player.dto';

export class BulkPlayerDataDto {
	@ApiProperty({
		description: 'Array of player data to upsert',
		type: [UpsertPlayerDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpsertPlayerDto)
	players: UpsertPlayerDto[];
}
