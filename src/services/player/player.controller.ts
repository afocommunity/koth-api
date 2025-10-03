import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetPlayerQueryDto } from './dtos/get-player-query.dto';

@Controller('player')
export class PlayerController {
	@Get('/:player_id')
	findPlayer(
		@Param('player_id') id: string,
		@Query() query: GetPlayerQueryDto,
	) {
    return query
  }
}
