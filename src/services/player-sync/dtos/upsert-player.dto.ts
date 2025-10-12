import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsOptional,
	IsInt,
	IsDateString,
	IsArray,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LoadoutItemDto {
	@ApiProperty({ description: 'Loadout family name (e.g., "primary", "secondary")' })
	@IsString()
	family_name: string;

	@ApiProperty({ description: 'Item class name' })
	@IsString()
	item: string;

	@ApiProperty({ description: 'Loadout slot index' })
	@IsInt()
	slot: number;

	@ApiProperty({ description: 'Item count/quantity' })
	@IsInt()
	item_count: number;
}

class WeaponXPDto {
	@ApiProperty({ description: 'Weapon class name' })
	@IsString()
	weapon_name: string;

	@ApiProperty({ description: 'XP earned for this weapon' })
	@IsInt()
	xp: number;
}

class PermaUnlockDto {
	@ApiProperty({ description: 'Unlock identifier' })
	@IsString()
	unlock_name: string;
}

class PlayerSaveDto {
	@ApiProperty({ description: 'Current cash balance' })
	@IsInt()
	cash: number;

	@ApiProperty({ description: 'Total cash earned' })
	@IsInt()
	cash_total: number;

	@ApiProperty({ description: 'Current XP' })
	@IsInt()
	xp: number;

	@ApiProperty({ description: 'Total XP earned' })
	@IsInt()
	xp_total: number;

	@ApiProperty({ description: 'Independent faction skin' })
	@IsString()
	skin_indfor: string;

	@ApiProperty({ description: 'BLUFOR faction skin' })
	@IsString()
	skin_blufor: string;

	@ApiProperty({ description: 'REDFOR faction skin' })
	@IsString()
	skin_redfor: string;

	@ApiProperty({ description: 'Perk slot 1', required: false })
	@IsOptional()
	@IsString()
	perk1?: string;

	@ApiProperty({ description: 'Perk slot 2', required: false })
	@IsOptional()
	@IsString()
	perk2?: string;

	@ApiProperty({ description: 'Perk slot 3', required: false })
	@IsOptional()
	@IsString()
	perk3?: string;

	@ApiProperty({ description: 'Save file version' })
	@IsString()
	version: string;

	@ApiProperty({ description: 'Player loadout items', type: [LoadoutItemDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => LoadoutItemDto)
	loadout: LoadoutItemDto[];

	@ApiProperty({ description: 'Weapon XP progression', type: [WeaponXPDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => WeaponXPDto)
	weapon_xp: WeaponXPDto[];

	@ApiProperty({
		description: 'Permanent unlocks',
		type: [PermaUnlockDto],
		required: false,
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => PermaUnlockDto)
	perma_unlocks?: PermaUnlockDto[];
}

export class UpsertPlayerDto {
	@ApiProperty({
		description: 'Steam ID (17 characters)',
		required: false,
		example: '76561198000000000',
	})
	@IsOptional()
	@IsString()
	steam_id?: string;

	@ApiProperty({
		description: 'Epic Online Services ID (32 characters)',
		example: '00112233445566778899aabbccddeeff',
	})
	@IsString()
	eos_id: string;

	@ApiProperty({ description: 'Last known player name' })
	@IsString()
	last_known_as: string;

	@ApiProperty({ description: 'Timestamp of last known name change' })
	@IsDateString()
	last_known_at: string;

	@ApiProperty({ description: 'Server identifier where player was last seen' })
	@IsString()
	last_seen_on: string;

	@ApiProperty({ description: 'Timestamp of last activity' })
	@IsDateString()
	last_seen_at: string;

	@ApiProperty({
		description: 'Player save file data',
		type: PlayerSaveDto,
		required: false,
	})
	@IsOptional()
	@ValidateNested()
	@Type(() => PlayerSaveDto)
	save_file?: PlayerSaveDto;
}
