import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from '@/models/organization.model';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
import { createId } from '@/utils/createId';

@Injectable()
export class OrganizationRepository {
	constructor(
		@InjectModel(Organization)
		private readonly organizationModel: typeof Organization,
	) {}

	async create(createOrganizationDto: CreateOrganizationDto) {
		return this.organizationModel.create({
			id: createId(),
			...createOrganizationDto,
		});
	}

	async findAll() {
		return this.organizationModel.findAll({
			order: [['createdAt', 'DESC']],
		});
	}

	async findOne(id: string) {
		const organization = await this.organizationModel.findByPk(id);
		if (!organization) {
			throw new NotFoundException(`Organization with ID ${id} not found`);
		}
		return organization;
	}

	async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
		const organization = await this.findOne(id);
		return organization.update(updateOrganizationDto);
	}

	async remove(id: string) {
		const organization = await this.findOne(id);
		await organization.destroy();
		return { message: 'Organization deleted successfully' };
	}
}
