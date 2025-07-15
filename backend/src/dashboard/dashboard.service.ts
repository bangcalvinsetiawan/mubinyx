import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getPublicStats() {
    // Total projects
    const totalProjects = await this.prisma.project.count({
      where: { status: 'ACTIVE' }
    });

    // Total investments amount
    const totalInvestmentsResult = await this.prisma.investment.aggregate({
      _sum: {
        amount: true
      }
    });

    // Total investors (unique users)
    const totalInvestors = await this.prisma.investment.groupBy({
      by: ['userId'],
      _count: {
        userId: true
      }
    });

    // Average ROI
    const avgRoiResult = await this.prisma.project.aggregate({
      _avg: {
        roiPercentage: true
      },
      where: { status: 'ACTIVE' }
    });

    return {
      totalProjects,
      totalInvestments: this.formatCurrency(Number(totalInvestmentsResult._sum.amount || 0)),
      totalInvestors: totalInvestors.length,
      averageRoi: Number(avgRoiResult._avg.roiPercentage || 0).toFixed(1),
      totalInvestmentsRaw: Number(totalInvestmentsResult._sum.amount || 0)
    };
  }

  async getUserStats(userId: string) {
    // User wallet balance
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId }
    });

    // User total investments
    const userInvestmentsResult = await this.prisma.investment.aggregate({
      where: { userId },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });

    // User pending transactions
    const pendingTransactions = await this.prisma.walletTransaction.count({
      where: {
        wallet: { userId },
        status: 'PENDING'
      }
    });

    return {
      walletBalance: this.formatCurrency(Number(wallet?.balance || 0)),
      walletBalanceRaw: Number(wallet?.balance || 0),
      totalInvestments: this.formatCurrency(Number(userInvestmentsResult._sum.amount || 0)),
      totalInvestmentsCount: userInvestmentsResult._count.id,
      pendingTransactions
    };
  }

  async getAdminStats() {
    // Total users
    const totalUsers = await this.prisma.user.count();

    // Total admins
    const totalAdmins = await this.prisma.user.count({
      where: {
        role: {
          in: ['ADMIN', 'SUPER_ADMIN']
        }
      }
    });

    // Total investments amount
    const totalInvestmentsResult = await this.prisma.investment.aggregate({
      _sum: {
        amount: true
      }
    });

    // Total wallet balance across all users
    const totalBalanceResult = await this.prisma.wallet.aggregate({
      _sum: {
        balance: true
      }
    });

    return {
      totalUsers,
      totalAdmins,
      totalInvestments: Number(totalInvestmentsResult._sum.amount || 0),
      totalBalance: Number(totalBalanceResult._sum.balance || 0)
    };
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}
