import { NestFactory } from '@nestjs/core';
import { PluginFileModule } from './plugin-file/plugin-file.module';

async function bootstrap() {
	const app = await NestFactory.create(PluginFileModule);
	await app.listen(3131);
}
bootstrap();
