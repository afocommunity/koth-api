import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
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
import { ServerService } from './server.service';
import { CreateServerDto } from './dtos/create-server.dto';
import { UpdateServerDto } from './dtos/update-server.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('server')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('server')
export class ServerController {
	constructor(private readonly serverService: ServerService) {}

	@ApiOperation({ summary: 'Create a new server' })
	@ApiCreatedResponse({ description: 'Server created successfully' })
	@ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
	@Post()
	create(@Body() createServerDto: CreateServerDto) {
		return this.serverService.create(createServerDto);
	}

	@ApiOperation({ summary: 'Get all servers, optionally filtered by organization' })
	@ApiQuery({
		name: 'org_id',
		required: false,
		description: 'Filter servers by organization ID',
	})
	@ApiOkResponse({ description: 'List of servers' })
	@ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
	@Get()
	findAll(@Query('org_id') org_id?: string) {
		return this.serverService.findAll(org_id);
	}

	@ApiOperation({ summary: 'Get server by ID' })
	@ApiOkResponse({ description: 'Server found' })
	@ApiNotFoundResponse({ description: 'Server not found' })
	@ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.serverService.findOne(id);
	}

	@ApiOperation({ summary: 'Update server' })
	@ApiOkResponse({ description: 'Server updated successfully' })
	@ApiNotFoundResponse({ description: 'Server not found' })
	@ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateServerDto: UpdateServerDto) {
		return this.serverService.update(id, updateServerDto);
	}

	@ApiOperation({ summary: 'Delete server' })
	@ApiOkResponse({ description: 'Server deleted successfully' })
	@ApiNotFoundResponse({ description: 'Server not found' })
	@ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.serverService.remove(id);
	}
}
