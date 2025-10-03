import { Module } from '@nestjs/common';
import { PluginFileController } from './controllers/plugin-file.controller';

@Module({ controllers: [PluginFileController] })
export class PluginFileModule {}
