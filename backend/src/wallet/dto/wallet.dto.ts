import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class TopUpWalletDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  paymentMethod: string; // 'bank_transfer', 'crypto', 'paypal', etc.

  @IsOptional()
  @IsString()
  paymentReference?: string; // Transaction ID, proof of payment, etc.

  @IsOptional()
  @IsString()
  notes?: string;
}

export class WithdrawWalletDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  withdrawMethod: string; // 'bank_transfer', 'crypto', 'paypal', etc.

  @IsString()
  accountDetails: string; // Bank account, crypto address, etc.

  @IsOptional()
  @IsString()
  notes?: string;
}
