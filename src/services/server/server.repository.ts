import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Server } from '@/models/server.model';
import { CreateServerDto } from './dtos/create-server.dto';
import { UpdateServerDto } from './dtos/update-server.dto';
import { createId } from '@/utils/createId';
import { DataNotFoundError } from '@/errors/DataNotFoundError';

@Injectable()
export class ServerRepository {
	constructor(
		@InjectModel(Server)
		private readonly serverModel: typeof Server,
	) {}

	async create(createServerDto: CreateServerDto) {
		return this.serverModel.create({
			id: createId(),
			...createServerDto,
		});
	}

	async findAll(org_id?: string) {
		const where = org_id ? { org_id } : {};
		return this.serverModel.findAll({
			where,
			order: [['createdAt', 'DESC']],
		});
	}

	async findOne(id: string) {
		const server = await this.serverModel.findByPk(id);
		if (!server) {
			throw new DataNotFoundError(`Server with ID ${id} not found`);
		}
		return server;
	}

	async update(id: string, updateServerDto: UpdateServerDto) {
		const server = await this.findOne(id);
		return server.update(updateServerDto);
	}

	async remove(id: string) {
		const server = await this.findOne(id);
		await server.destroy();
		return { message: 'Server deleted successfully' };
	}
}
