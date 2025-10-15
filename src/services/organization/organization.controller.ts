import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import {
	ApiTags,
	ApiBearerAuth,
	ApiOperation,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiNotFoundResponse,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('organization')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('organization')
export class OrganizationController {
	constructor(private readonly organizationService: OrganizationService) {}

	@ApiOperation({ summary: 'Create a new organization' })
	@ApiCreatedResponse({ description: 'Organization created successfully' })
	@ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
	@Post()
	create(@Body() createOrganizationDto: CreateOrganizationDto) {
		return this.organizationService.create(createOrganizationDto);
	}

	@ApiOperation({ summary: 'Get all organizations' })
	@ApiOkResponse({ description: 'List of all organizations' })
	@ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
	@Get()
	findAll() {
		return this.organizationService.findAll();
	}

	@ApiOperation({ summary: 'Get organization by ID' })
	@ApiOkResponse({ description: 'Organization found' })
	@ApiNotFoundResponse({ description: 'Organization not found' })
	@ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.organizationService.findOne(id);
	}

	@ApiOperation({ summary: 'Update organization' })
	@ApiOkResponse({ description: 'Organization updated successfully' })
	@ApiNotFoundResponse({ description: 'Organization not found' })
	@ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateOrganizationDto: UpdateOrganizationDto,
	) {
		return this.organizationService.update(id, updateOrganizationDto);
	}

	@ApiOperation({ summary: 'Delete organization' })
	@ApiOkResponse({ description: 'Organization deleted successfully' })
	@ApiNotFoundResponse({ description: 'Organization not found' })
	@ApiUnauthorizedResponse({ description: 'Invalid or missing JWT token' })
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.organizationService.remove(id);
	}
}
