import { Module } from '@nestjs/common';
import { PluginFileController } from './plugin-file.controller';

@Module({ controllers: [PluginFileController] })
export class PluginFileModule {}
