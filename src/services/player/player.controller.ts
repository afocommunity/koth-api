import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Query,
	NotFoundException,
	UseGuards,
} from '@nestjs/common';
import { GetPlayerQueryDto } from './dtos/get-player-query.dto';
import { UpsertPlayerDto } from './dtos/upsert-player.dto';
import { BulkPlayerDataDto } from './dtos/bulk-player-data.dto';
import { PlayerService } from './player.service';
import {
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiCreatedResponse,
	ApiBearerAuth,
	ApiUnauthorizedResponse,
	ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ApiTokenGuard } from '../auth/guards/api-token.guard';

@Controller('player')
export class PlayerController {
	constructor(private readonly playerService: PlayerService) {}

	@ApiOperation({ summary: 'Find a player by ID' })
	@ApiOkResponse({
		description: 'A Player Object',
	})
	@ApiNotFoundResponse({ description: 'Player not found' })
	@Get('/:player_id')
	public async findPlayer(
		@Param('player_id') id: string,
		@Query() query: GetPlayerQueryDto,
	) {
		const include = Array.from(
			new Set(
				query.include != null
					? typeof query.include === 'string'
						? query.include.split(',')
						: query.include
					: null,
			),
		);
		const id_type = query.by;
		const player = await this.playerService.findPlayer(id, id_type, include);
		if (player == null) throw new NotFoundException();
		return player;
	}

	@ApiOperation({
		summary: 'Upsert a player with full save data',
		description:
			'Create or update a player record with all nested data (save file, loadout, weapon XP, perma unlocks). Requires authentication.',
	})
	@ApiBearerAuth()
	@ApiCreatedResponse({
		description: 'Player created or updated successfully',
	})
	@ApiUnauthorizedResponse({ description: 'Invalid or missing API token' })
	@ApiBadRequestResponse({ description: 'Invalid request data' })
	@UseGuards(ApiTokenGuard)
	@Post()
	public async upsertPlayer(@Body() data: UpsertPlayerDto) {
		return this.playerService.upsertPlayer(data);
	}

	@ApiOperation({
		summary: 'Bulk upsert multiple players',
		description:
			'Create or update multiple player records in a single request. Returns summary of successful and failed operations. Requires authentication.',
	})
	@ApiBearerAuth()
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
		return this.playerService.bulkUpsertPlayers(data.players);
	}
}
