import { PlayerController } from '@/controllers/PlayerController';
import { asyncHandler } from '@/utils/asyncHandler';
import express from 'express';

export const players = express.Router();
players.get('/:player_id', asyncHandler(PlayerController.reqFindPlayer));
