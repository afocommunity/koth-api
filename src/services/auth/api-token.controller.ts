import {
	Controller,
	Get,
	Post,
	Delete,
	Body,
	Param,
	UseGuards,
	Query,
} from '@nestjs/common';
import {
	ApiTags,
	ApiBearerAuth,
	ApiOperation,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiNotFoundResponse,
	ApiUnauthorizedResponse,
	ApiQuery,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateApiTokenDto } from './dtos/create-api-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('api-token')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('api-token')
export class ApiTokenController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: 'Generate a new API token for a server' })
	@ApiCreatedResponse({ description: 'API token created successfully' })
	@ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
	@Post()
	create(@Body() createApiTokenDto: CreateApiTokenDto) {
		return this.authService.createApiToken(createApiTokenDto);
	}

	@ApiOperation({
		summary: 'List all API tokens, optionally filtered by org or server',
	})
	@ApiQuery({
		name: 'org_id',
		required: false,
		description: 'Filter by organization ID',
	})
	@ApiQuery({
		name: 'server_id',
		required: false,
		description: 'Filter by server ID',
	})
	@ApiOkResponse({ description: 'List of API tokens' })
	@ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
	@Get()
	findAll(@Query('org_id') org_id?: string, @Query('server_id') server_id?: string) {
		return this.authService.findAllApiTokens(org_id, server_id);
	}

	@ApiOperation({ summary: 'Revoke an API token' })
	@ApiOkResponse({ description: 'API token revoked successfully' })
	@ApiNotFoundResponse({ description: 'API token not found' })
	@ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.authService.revokeApiToken(id);
	}
}
