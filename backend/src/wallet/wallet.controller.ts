import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';
import { TopUpWalletDto, WithdrawWalletDto } from './dto/wallet.dto';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async getWallet(@Request() req) {
    return this.walletService.getWallet(req.user.userId);
  }

  @Get('transactions')
  async getUserTransactions(@Request() req) {
    return this.walletService.getUserTransactions(req.user.userId);
  }

  @Post('topup')
  async topUpWallet(@Request() req, @Body() topUpDto: TopUpWalletDto) {
    return this.walletService.createTopUpRequest(req.user.userId, topUpDto);
  }

  @Post('withdraw')
  async withdrawWallet(@Request() req, @Body() withdrawDto: WithdrawWalletDto) {
    return this.walletService.createWithdrawRequest(req.user.userId, withdrawDto);
  }

  // Admin endpoints
  @Get('admin/pending-transactions')
  async getPendingTransactions(@Request() req) {
    // Add admin role check here
    return this.walletService.getPendingTransactions();
  }

  @Post('admin/approve/:id')
  async approveTransaction(@Request() req, @Param('id') transactionId: string) {
    // Add admin role check here
    return this.walletService.approveTransaction(transactionId);
  }

  @Post('admin/reject/:id')
  async rejectTransaction(@Request() req, @Param('id') transactionId: string, @Body() body: { reason?: string }) {
    // Add admin role check here
    return this.walletService.rejectTransaction(transactionId, body.reason);
  }
}
