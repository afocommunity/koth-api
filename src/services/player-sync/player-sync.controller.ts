import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
	ApiOperation,
	ApiCreatedResponse,
	ApiBearerAuth,
	ApiUnauthorizedResponse,
	ApiBadRequestResponse,
	ApiTags,
} from '@nestjs/swagger';
import { PlayerSyncService } from './player-sync.service';
import { ApiTokenGuard } from '../auth/guards/api-token.guard';
import { UpsertPlayerDto } from './dtos/upsert-player.dto';
import { BulkPlayerDataDto } from './dtos/bulk-player-data.dto';

@ApiTags('player-sync')
@Controller('player-sync')
export class PlayerSyncController {
	constructor(private readonly playerSyncService: PlayerSyncService) {}

	@ApiOperation({
		summary: 'Upsert a player with full save data',
		description:
			'Create or update a player record with all nested data (save file, loadout, weapon XP, perma unlocks). Requires authentication.',
	})
	@ApiBearerAuth('bearer')
	@ApiCreatedResponse({
		description: 'Player created or updated successfully',
	})
	@ApiUnauthorizedResponse({ description: 'Invalid or missing API token' })
	@ApiBadRequestResponse({ description: 'Invalid request data' })
	@UseGuards(ApiTokenGuard)
	@Post()
	public async upsertPlayer(@Body() data: UpsertPlayerDto) {
		return this.playerSyncService.upsertPlayer(data);
	}

	@ApiOperation({
		summary: 'Bulk upsert multiple players',
		description:
			'Create or update multiple player records in a single request. Returns summary of successful and failed operations. Requires authentication.',
	})
	@ApiBearerAuth('bearer')
	@ApiCreatedResponse({
		description: 'Bulk operation completed',
		schema: {
			type: 'object',
			properties: {
				total: { type: 'number', description: 'Total players processed' },
				successful: {
					type: 'number',
					description: 'Number of successful operations',
				},
				failed: { type: 'number', description: 'Number of failed operations' },
				results: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							index: { type: 'number' },
							eos_id: { type: 'string' },
							status: { type: 'string', enum: ['fulfilled', 'rejected'] },
							error: { type: 'string' },
						},
					},
				},
			},
		},
	})
	@ApiUnauthorizedResponse({ description: 'Invalid or missing API token' })
	@ApiBadRequestResponse({ description: 'Invalid request data' })
	@UseGuards(ApiTokenGuard)
	@Post('/bulk')
	public async bulkUpsertPlayers(@Body() data: BulkPlayerDataDto) {
		return this.playerSyncService.bulkUpsertPlayers(data.players);
	}
}
