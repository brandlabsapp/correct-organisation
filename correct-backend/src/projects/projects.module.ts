import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { projectsProviders } from './projects.provider';

@Module({
	controllers: [ProjectsController],
	providers: [ProjectsService, ...projectsProviders],
	exports: [ProjectsService, ...projectsProviders],
})
export class ProjectsModule {}
