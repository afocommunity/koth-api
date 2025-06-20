import { PlayerController } from '@/controllers/PlayerController';
import { AuthMiddleware } from '@/middleware/Auth';
import { asyncHandler } from '@/utils/asyncHandler';
import express from 'express';

export const players = express.Router();
players.get(
	'/:player_id',
	asyncHandler(
		AuthMiddleware.bearerTokenAuth('PLAYERS:GET'),
		PlayerController.reqFindPlayer,
	),
);
