import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Project, ProjectStatus } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Op } from 'sequelize';

@Injectable()
export class ProjectsService {
	constructor(
		@Inject('PROJECT_REPOSITORY')
		private readonly projectRepository: typeof Project
	) {}

	async create(
		companyId: number,
		createProjectDto: CreateProjectDto
	): Promise<Project> {
		return this.projectRepository.create({
			...createProjectDto,
			companyId,
			startDate: createProjectDto.startDate
				? new Date(createProjectDto.startDate)
				: null,
			endDate: createProjectDto.endDate
				? new Date(createProjectDto.endDate)
				: null,
		});
	}

	async findAll(
		companyId: number,
		options?: {
			status?: ProjectStatus;
			clientId?: string;
			search?: string;
			limit?: number;
			offset?: number;
		}
	): Promise<{ rows: Project[]; count: number }> {
		const where: any = { companyId };

		if (options?.status) {
			where.status = options.status;
		}

		if (options?.clientId) {
			where.clientId = options.clientId;
		}

		if (options?.search) {
			where[Op.or] = [
				{ name: { [Op.iLike]: `%${options.search}%` } },
				{ code: { [Op.iLike]: `%${options.search}%` } },
			];
		}

		return this.projectRepository.findAndCountAll({
			where,
			limit: options?.limit || 50,
			offset: options?.offset || 0,
			order: [['createdAt', 'DESC']],
		});
	}

	async findOne(id: string, companyId: number): Promise<Project> {
		const project = await this.projectRepository.findOne({
			where: { id, companyId },
		});

		if (!project) {
			throw new NotFoundException(`Project with ID ${id} not found`);
		}

		return project;
	}

	async update(
		id: string,
		companyId: number,
		updateProjectDto: UpdateProjectDto
	): Promise<Project> {
		const project = await this.findOne(id, companyId);
		await project.update({
			...updateProjectDto,
			startDate: updateProjectDto.startDate
				? new Date(updateProjectDto.startDate)
				: project.startDate,
			endDate: updateProjectDto.endDate
				? new Date(updateProjectDto.endDate)
				: project.endDate,
		});
		return project;
	}

	async remove(id: string, companyId: number): Promise<void> {
		const project = await this.findOne(id, companyId);
		await project.destroy();
	}
}
