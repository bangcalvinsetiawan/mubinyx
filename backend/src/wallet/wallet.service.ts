import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TopUpWalletDto, WithdrawWalletDto } from './dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getUserWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return {
      ...wallet,
      balanceFormatted: this.formatCurrency(Number(wallet.balance)),
      lockedBalanceFormatted: this.formatCurrency(Number(wallet.lockedBalance))
    };
  }

  async getWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId }
    });

    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: {
          userId,
          balance: 0,
          lockedBalance: 0
        }
      });
    }

    return {
      id: wallet.id,
      balance: wallet.balance.toNumber(),
      balanceFormatted: this.formatCurrency(wallet.balance.toNumber()),
      lockedBalance: wallet.lockedBalance.toNumber(),
      lockedBalanceFormatted: this.formatCurrency(wallet.lockedBalance.toNumber())
    };
  }

  async getUserTransactions(userId: string, page = 1, limit = 20) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId }
    });

    if (!wallet) {
      return [];
    }

    const transactions = await this.prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    return transactions.map(tx => ({
      id: tx.id,
      type: tx.type,
      amount: tx.amount.toNumber(),
      amountFormatted: this.formatCurrency(tx.amount.toNumber()),
      status: tx.status,
      description: tx.description,
      createdAt: tx.createdAt.toISOString()
    }));
  }

  async createTopUpRequest(userId: string, topUpDto: TopUpWalletDto) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId }
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const transaction = await this.prisma.walletTransaction.create({
      data: {
        userId,
        walletId: wallet.id,
        type: 'DEPOSIT',
        amount: topUpDto.amount,
        description: `Top up via ${topUpDto.paymentMethod}`,
        metadata: JSON.stringify({
          paymentMethod: topUpDto.paymentMethod,
          paymentReference: topUpDto.paymentReference,
          notes: topUpDto.notes
        })
      }
    });

    return {
      ...transaction,
      amountFormatted: this.formatCurrency(Number(transaction.amount)),
      message: 'Top up request created successfully. Waiting for admin approval.'
    };
  }

  async createWithdrawRequest(userId: string, withdrawDto: WithdrawWalletDto) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId }
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (Number(wallet.balance) < withdrawDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Lock the withdrawal amount
    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: Number(wallet.balance) - withdrawDto.amount,
        lockedBalance: Number(wallet.lockedBalance) + withdrawDto.amount
      }
    });

    const transaction = await this.prisma.walletTransaction.create({
      data: {
        userId,
        walletId: wallet.id,
        type: 'WITHDRAWAL',
        amount: withdrawDto.amount,
        description: `Withdrawal via ${withdrawDto.withdrawMethod}`,
        metadata: JSON.stringify({
          withdrawMethod: withdrawDto.withdrawMethod,
          accountDetails: withdrawDto.accountDetails,
          notes: withdrawDto.notes
        })
      }
    });

    return {
      ...transaction,
      amountFormatted: this.formatCurrency(Number(transaction.amount)),
      message: 'Withdrawal request created successfully. Waiting for admin approval.'
    };
  }

  async getPendingTransactions() {
    const transactions = await this.prisma.walletTransaction.findMany({
      where: {
        status: 'PENDING'
      },
      include: {
        wallet: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return transactions.map(tx => ({
      ...tx,
      amountFormatted: this.formatCurrency(Number(tx.amount))
    }));
  }

  async approveTransaction(transactionId: string) {
    const transaction = await this.prisma.walletTransaction.findUnique({
      where: { id: transactionId },
      include: { wallet: true }
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status !== 'PENDING') {
      throw new BadRequestException('Transaction is not pending');
    }

    await this.prisma.$transaction(async (prisma) => {
      // Update transaction status
      await prisma.walletTransaction.update({
        where: { id: transactionId },
        data: { status: 'COMPLETED' }
      });

      // Update wallet balance based on transaction type
      if (transaction.type === 'DEPOSIT') {
        await prisma.wallet.update({
          where: { id: transaction.walletId },
          data: {
            balance: Number(transaction.wallet.balance) + Number(transaction.amount)
          }
        });
      } else if (transaction.type === 'WITHDRAWAL') {
        // Release locked balance (already deducted from balance)
        await prisma.wallet.update({
          where: { id: transaction.walletId },
          data: {
            lockedBalance: Number(transaction.wallet.lockedBalance) - Number(transaction.amount)
          }
        });
      }
    });

    return { message: 'Transaction approved successfully' };
  }

  async rejectTransaction(transactionId: string, reason?: string) {
    const transaction = await this.prisma.walletTransaction.findUnique({
      where: { id: transactionId },
      include: { wallet: true }
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status !== 'PENDING') {
      throw new BadRequestException('Transaction is not pending');
    }

    await this.prisma.$transaction(async (prisma) => {
      // Update transaction status
      await prisma.walletTransaction.update({
        where: { id: transactionId },
        data: { status: 'FAILED' }
      });

      // If withdrawal, return locked balance to available balance
      if (transaction.type === 'WITHDRAWAL') {
        await prisma.wallet.update({
          where: { id: transaction.walletId },
          data: {
            balance: Number(transaction.wallet.balance) + Number(transaction.amount),
            lockedBalance: Number(transaction.wallet.lockedBalance) - Number(transaction.amount)
          }
        });
      }
    });

    return { message: 'Transaction rejected successfully' };
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
