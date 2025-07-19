import { PluginController } from '@/controllers/PluginController';
import { asyncHandler } from '@/utils/asyncHandler';
import express from 'express';

export const plugin = express.Router();
plugin.get('/version', asyncHandler(PluginController.reqVersion));
plugin.get('/download', asyncHandler(PluginController.reqDownload));
