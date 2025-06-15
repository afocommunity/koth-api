import express from 'express';
import { players } from './players.router';
export const routing = express.Router();
routing.use('/players', players);
