import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  async getUserCompleteProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallet: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 10
            }
          }
        },
        investments: {
          include: {
            project: {
              include: {
                category: true
              }
            }
          }
        },
        walletTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        notifications: {
          where: { isRead: false },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        verification: true,
        referrals: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate derived statistics
    const totalInvestmentAmount = user.investments.reduce(
      (sum, inv) => sum + Number(inv.amount), 0
    );

    const activeInvestments = user.investments.filter(
      inv => inv.status === 'active'
    );

    const portfolioValue = user.investments.reduce(
      (sum, inv) => sum + Number(inv.expectedReturn), 0
    );

    const walletBalance = user.wallet?.balance ? Number(user.wallet.balance) : 0;
    const lockedBalance = user.wallet?.lockedBalance ? Number(user.wallet.lockedBalance) : 0;

    return {
      userInfo: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        referralCode: user.referralCode
      },
      walletInfo: {
        balance: walletBalance,
        balanceFormatted: this.formatCurrency(walletBalance),
        lockedBalance: lockedBalance,
        lockedBalanceFormatted: this.formatCurrency(lockedBalance),
        totalBalance: walletBalance + lockedBalance,
        totalBalanceFormatted: this.formatCurrency(walletBalance + lockedBalance),
        recentTransactions: user.walletTransactions.map(tx => ({
          id: tx.id,
          type: tx.type,
          amount: Number(tx.amount),
          amountFormatted: this.formatCurrency(Number(tx.amount)),
          status: tx.status,
          description: tx.description,
          createdAt: tx.createdAt
        }))
      },
      investmentInfo: {
        totalInvested: totalInvestmentAmount,
        totalInvestedFormatted: this.formatCurrency(totalInvestmentAmount),
        portfolioValue: portfolioValue,
        portfolioValueFormatted: this.formatCurrency(portfolioValue),
        totalProjects: user.investments.length,
        activeInvestments: activeInvestments.length,
        investments: user.investments.map(inv => ({
          id: inv.id,
          amount: Number(inv.amount),
          amountFormatted: this.formatCurrency(Number(inv.amount)),
          expectedReturn: Number(inv.expectedReturn),
          expectedReturnFormatted: this.formatCurrency(Number(inv.expectedReturn)),
          status: inv.status,
          startDate: inv.startDate,
          maturityDate: inv.maturityDate,
          project: {
            id: inv.project.id,
            name: inv.project.name,
            slug: inv.project.slug,
            category: inv.project.category.name,
            roiPercentage: Number(inv.project.roiPercentage),
            riskLevel: inv.project.riskLevel,
            status: inv.project.status
          }
        }))
      },
      networkInfo: {
        referralsCount: user.referrals.length,
        referrals: user.referrals
      },
      activityInfo: {
        unreadNotifications: user.notifications.length,
        recentNotifications: user.notifications,
        verificationStatus: user.verification?.status || 'not_submitted'
      }
    };
  }

  async getAllUsersCorrelations() {
    const users = await this.prisma.user.findMany({
      include: {
        wallet: true,
        investments: {
          include: {
            project: {
              include: {
                category: true
              }
            }
          }
        },
        _count: {
          select: {
            investments: true,
            referrals: true,
            walletTransactions: true
          }
        }
      }
    });

    return users.map(user => {
      const totalInvestment = user.investments.reduce(
        (sum, inv) => sum + Number(inv.amount), 0
      );
      
      const portfolioValue = user.investments.reduce(
        (sum, inv) => sum + Number(inv.expectedReturn), 0
      );

      const walletBalance = user.wallet?.balance ? Number(user.wallet.balance) : 0;

      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        joinDate: user.createdAt,
        wallet: {
          balance: walletBalance,
          balanceFormatted: this.formatCurrency(walletBalance),
          lockedBalance: user.wallet?.lockedBalance ? Number(user.wallet.lockedBalance) : 0
        },
        investment: {
          totalInvested: totalInvestment,
          totalInvestedFormatted: this.formatCurrency(totalInvestment),
          portfolioValue: portfolioValue,
          portfolioValueFormatted: this.formatCurrency(portfolioValue),
          projectsCount: user._count.investments,
          activeProjects: user.investments.filter(inv => inv.status === 'active').length
        },
        activity: {
          transactionsCount: user._count.walletTransactions,
          referralsCount: user._count.referrals
        },
        projects: user.investments.map(inv => ({
          projectName: inv.project.name,
          category: inv.project.category.name,
          amount: Number(inv.amount),
          status: inv.status,
          roi: Number(inv.project.roiPercentage)
        }))
      };
    });
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
