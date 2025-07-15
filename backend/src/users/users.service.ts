import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        wallet: {
          select: {
            balance: true,
            lockedBalance: true,
            transactions: {
              where: {
                status: 'PENDING'
              },
              select: {
                id: true,
                type: true,
                amount: true,
                status: true,
                createdAt: true
              }
            }
          }
        },
        investments: {
          select: {
            id: true,
            amount: true,
            expectedReturn: true,
            status: true,
            project: {
              select: {
                name: true,
                slug: true,
                roiPercentage: true,
                durationMonths: true
              }
            }
          }
        },
        verification: {
          select: {
            status: true,
            documentType: true,
            rejectionReason: true,
            verifiedAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return users.map(user => ({
      ...user,
      totalInvestment: user.investments.reduce((sum, inv) => sum + Number(inv.amount), 0),
      activeInvestments: user.investments.filter(inv => inv.status === 'ACTIVE').length,
      pendingTransactions: user.wallet?.transactions.length || 0,
      kycStatus: user.verification?.status || 'NOT_SUBMITTED'
    }));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(createUserDto: any) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role || 'USER',
        phone: createUserDto.phone || null,
        referralCode: `REF_${Date.now()}`,
        emailVerified: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        emailVerified: true,
        createdAt: true
      }
    });

    // Create wallet for the user
    await this.prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
        lockedBalance: 0
      }
    });

    return user;
  }

  async update(id: string, updateUserDto: any) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being changed and if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email }
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        role: updateUserDto.role,
        phone: updateUserDto.phone
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return updatedUser;
  }

  async updateStatus(id: string, status: string) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete related records first
    await this.prisma.walletTransaction.deleteMany({
      where: { wallet: { userId: id } }
    });

    await this.prisma.investment.deleteMany({
      where: { userId: id }
    });

    await this.prisma.wallet.deleteMany({
      where: { userId: id }
    });

    // Delete the user
    await this.prisma.user.delete({
      where: { id }
    });

    return { message: 'User deleted successfully' };
  }
}
