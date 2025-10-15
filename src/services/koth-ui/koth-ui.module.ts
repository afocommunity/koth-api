import { Module } from '@nestjs/common';
import { KothUIService } from './koth-ui.service';

@Module({
	providers: [KothUIService],
	exports: [KothUIService],
})
export class KothUIModule {}
