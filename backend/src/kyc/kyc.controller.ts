import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  UseInterceptors,
  UploadedFiles,
  BadRequestException
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { KycService } from './kyc.service';

@Controller('kyc')
@UseGuards(JwtAuthGuard)
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('submit')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'document', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
  ]))
  async submitKyc(
    @Request() req,
    @Body() kycData: any,
    @UploadedFiles() files: { document?: Express.Multer.File[], selfie?: Express.Multer.File[] }
  ) {
    if (!files.document || !files.selfie) {
      throw new BadRequestException('Both document and selfie are required');
    }

    const fileData = {
      document: files.document[0],
      selfie: files.selfie[0]
    };

    return this.kycService.submitKyc(req.user.userId, kycData, fileData);
  }

  @Get('my-status')
  async getMyKycStatus(@Request() req) {
    return this.kycService.getUserKyc(req.user.userId);
  }

  @Get('pending')
  async getPendingKyc(@Request() req) {
    // Only admin and super admin can access
    if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      throw new BadRequestException('Insufficient permissions');
    }
    
    return this.kycService.getAllPendingKyc();
  }

  @Patch(':id/approve')
  async approveKyc(@Request() req, @Param('id') id: string) {
    // Only admin and super admin can approve
    if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      throw new BadRequestException('Insufficient permissions');
    }

    return this.kycService.approveKyc(id, req.user.userId);
  }

  @Patch(':id/reject')
  async rejectKyc(
    @Request() req, 
    @Param('id') id: string,
    @Body() body: { reason: string }
  ) {
    // Only admin and super admin can reject
    if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      throw new BadRequestException('Insufficient permissions');
    }

    return this.kycService.rejectKyc(id, req.user.userId, body.reason);
  }

  @Get(':userId')
  async getUserKyc(@Request() req, @Param('userId') userId: string) {
    // Only admin/super admin can view other users' KYC
    if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user.role) && req.user.userId !== userId) {
      throw new BadRequestException('Insufficient permissions');
    }

    return this.kycService.getUserKyc(userId);
  }
}
