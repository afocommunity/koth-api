import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Organization } from '@/models/organization.model';
import { OrganizationRepository } from './organization.repository';

@Module({
	imports: [SequelizeModule.forFeature([Organization])],
	providers: [OrganizationRepository],
	exports: [OrganizationRepository],
})
export class OrganizationModule {}
