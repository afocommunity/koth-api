import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Organization } from '@/models/organization.model';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [SequelizeModule.forFeature([Organization]), AuthModule],
	controllers: [OrganizationController],
	providers: [OrganizationService],
	exports: [OrganizationService],
})
export class OrganizationModule {}
