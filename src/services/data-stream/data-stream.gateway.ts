import { UseGuards } from '@nestjs/common';
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	ConnectedSocket,
	MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ApiTokenGuard } from '../auth/guards/api-token.guard';
import { PlayerSyncService } from '../player-sync/player-sync.service';
import { UpsertPlayerDto } from '../player-sync/dtos/upsert-player.dto';

@WebSocketGateway({ namespace: 'data-stream', transports: ['websocket'] })
export class DataStreamGateway {
	@WebSocketServer()
	namespace: Server;

	constructor(private readonly playerSyncService: PlayerSyncService) {}

	@UseGuards(ApiTokenGuard)
	@SubscribeMessage('identity')
	async identity(@ConnectedSocket() client: Socket): Promise<string> {
		return client.id;
	}
	@UseGuards(ApiTokenGuard)
	@SubscribeMessage('update_user')
	async updateUser(@MessageBody() data: UpsertPlayerDto) {
		return this.playerSyncService.upsertPlayer(data);
	}
}
