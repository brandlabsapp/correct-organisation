import { Project } from './entities/project.entity';

export const projectsProviders = [
	{
		provide: 'PROJECT_REPOSITORY',
		useValue: Project,
	},
];
