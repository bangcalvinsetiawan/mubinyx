import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getProjects(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('riskLevel') riskLevel?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const filters = {
      category,
      status,
      riskLevel,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    };
    
    return this.projectsService.getProjects(filters);
  }

  @Get(':slug')
  async getProjectBySlug(@Param('slug') slug: string) {
    return this.projectsService.getProjectBySlug(slug);
  }

  @Get(':id/details')
  async getProjectDetails(@Param('id') id: string) {
    return this.projectsService.getProjectDetails(id);
  }
}
