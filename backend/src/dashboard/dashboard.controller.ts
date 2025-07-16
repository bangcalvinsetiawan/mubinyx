import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getPublicStats() {
    return this.dashboardService.getPublicStats();
  }

  @Get('public-stats')
  async getPublicStatsAlias() {
    return this.dashboardService.getPublicStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-stats')
  async getUserStats(@Request() req) {
    return this.dashboardService.getUserStats(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin-stats')
  async getAdminStats(@Request() req) {
    // Only allow admin or super admin to access this endpoint
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized');
    }
    return this.dashboardService.getAdminStats();
  }
}
