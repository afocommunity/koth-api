import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Organization } from '@/models/organization.model';
import { OrganizationService } from './organization.service';

@Module({
	imports: [SequelizeModule.forFeature([Organization])],
	providers: [OrganizationService],
	exports: [OrganizationService],
})
export class OrganizationModule {}
