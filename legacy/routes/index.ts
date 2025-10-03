import express from 'express';
import { players } from './players.router';
import { plugin } from './plugin.router';
export const routing = express.Router();
routing.use('/players', players);
routing.use('/plugin', plugin);
