import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());

	const config = new DocumentBuilder()
		.setTitle('KOTH API')
		.setDescription('API for interfacing with KapiSync')
		.setVersion('1.0')
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, documentFactory, {
		jsonDocumentUrl: 'swagger/json',
	});
	await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
