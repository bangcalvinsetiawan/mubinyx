import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserProfileService } from './user-profile.service';

@Controller('user-profile')
@UseGuards(JwtAuthGuard)
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('dashboard')
  async getUserDashboard(@Request() req) {
    return this.userProfileService.getUserCompleteProfile(req.user.id);
  }

  @Get('detailed/:userId')
  async getUserDetailedProfile(@Param('userId') userId: string, @Request() req) {
    // Add admin check here if needed
    return this.userProfileService.getUserCompleteProfile(userId);
  }

  @Get('correlations')
  async getAllUsersCorrelations(@Request() req) {
    // Admin only endpoint
    return this.userProfileService.getAllUsersCorrelations();
  }
}
