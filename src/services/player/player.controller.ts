import {
	Controller,
	Get,
	Param,
	Query,
	NotFoundException,
} from '@nestjs/common';
import { GetPlayerQueryDto } from './dtos/get-player-query.dto';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
	constructor(private readonly playerService: PlayerService) {}
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
}
