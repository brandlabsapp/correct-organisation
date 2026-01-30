import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	Query,
	Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from './entities/project.entity';

@Controller('projects')
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Post()
	create(@Req() req: any, @Body() createProjectDto: CreateProjectDto) {
		const companyId = req.query.company || req.body.companyId;
		return this.projectsService.create(companyId, createProjectDto);
	}

	@Get()
	findAll(
		@Req() req: any,
		@Query('status') status?: ProjectStatus,
		@Query('clientId') clientId?: string,
		@Query('search') search?: string,
		@Query('limit') limit?: string,
		@Query('offset') offset?: string
	) {
		const companyId = req.query.company;
		return this.projectsService.findAll(companyId, {
			status,
			clientId,
			search,
			limit: limit ? parseInt(limit, 10) : undefined,
			offset: offset ? parseInt(offset, 10) : undefined,
		});
	}

	@Get(':id')
	findOne(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.projectsService.findOne(id, companyId);
	}

	@Put(':id')
	update(
		@Req() req: any,
		@Param('id') id: string,
		@Body() updateProjectDto: UpdateProjectDto
	) {
		const companyId = req.query.company;
		return this.projectsService.update(id, companyId, updateProjectDto);
	}

	@Delete(':id')
	remove(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.projectsService.remove(id, companyId);
	}
}
