import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class KycService {
  constructor(private prisma: PrismaService) {}

  async submitKyc(userId: string, kycData: any, files: any) {
    // Check if user already has pending or approved KYC
    const existingKyc = await this.prisma.userVerification.findUnique({
      where: { userId }
    });

    if (existingKyc && (existingKyc.status === 'PENDING' || existingKyc.status === 'APPROVED')) {
      throw new BadRequestException('KYC already submitted or approved');
    }

    // Create uploads directory if not exists
    const uploadsDir = path.join(process.cwd(), 'uploads', 'kyc');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save document file
    const documentFile = files.document;
    const documentFileName = `${userId}-document-${Date.now()}.${documentFile.originalname.split('.').pop()}`;
    const documentPath = path.join(uploadsDir, documentFileName);
    fs.writeFileSync(documentPath, documentFile.buffer);

    // Save selfie file
    const selfieFile = files.selfie;
    const selfieFileName = `${userId}-selfie-${Date.now()}.${selfieFile.originalname.split('.').pop()}`;
    const selfiePath = path.join(uploadsDir, selfieFileName);
    fs.writeFileSync(selfiePath, selfieFile.buffer);

    // Create or update KYC record
    const kycRecord = await this.prisma.userVerification.upsert({
      where: { userId },
      create: {
        userId,
        documentType: kycData.documentType,
        documentNumber: kycData.documentNumber,
        documentUrl: `/uploads/kyc/${documentFileName}`,
        selfieUrl: `/uploads/kyc/${selfieFileName}`,
        status: 'PENDING'
      },
      update: {
        documentType: kycData.documentType,
        documentNumber: kycData.documentNumber,
        documentUrl: `/uploads/kyc/${documentFileName}`,
        selfieUrl: `/uploads/kyc/${selfieFileName}`,
        status: 'PENDING',
        rejectionReason: null
      }
    });

    return kycRecord;
  }

  async getAllPendingKyc() {
    return this.prisma.userVerification.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async approveKyc(verificationId: string, adminId: string) {
    const verification = await this.prisma.userVerification.findUnique({
      where: { id: verificationId }
    });

    if (!verification) {
      throw new NotFoundException('KYC verification not found');
    }

    return this.prisma.userVerification.update({
      where: { id: verificationId },
      data: {
        status: 'APPROVED',
        verifiedBy: adminId,
        verifiedAt: new Date(),
        rejectionReason: null
      }
    });
  }

  async rejectKyc(verificationId: string, adminId: string, reason: string) {
    const verification = await this.prisma.userVerification.findUnique({
      where: { id: verificationId }
    });

    if (!verification) {
      throw new NotFoundException('KYC verification not found');
    }

    return this.prisma.userVerification.update({
      where: { id: verificationId },
      data: {
        status: 'REJECTED',
        verifiedBy: adminId,
        verifiedAt: new Date(),
        rejectionReason: reason
      }
    });
  }

  async getUserKyc(userId: string) {
    return this.prisma.userVerification.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
  }
}
