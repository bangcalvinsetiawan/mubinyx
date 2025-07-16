import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data (optional, be careful in production)
    console.log('🧹 Cleaning existing data...');
    await prisma.investment.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.walletTransaction.deleteMany({});
    await prisma.cryptoTransaction.deleteMany({});
    await prisma.cryptoWallet.deleteMany({});
    await prisma.cryptoNetwork.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.userVerification.deleteMany({});
    await prisma.wallet.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.projectCategory.deleteMany({});

    // 1. Create Project Categories
    console.log('📊 Creating project categories...');
    const techCategory = await prisma.projectCategory.create({
      data: {
        name: 'Technology',
        slug: 'technology',
        description: 'Innovative technology projects',
        icon: '💻',
      },
    });

    const cryptoCategory = await prisma.projectCategory.create({
      data: {
        name: 'Cryptocurrency',
        slug: 'cryptocurrency',
        description: 'Blockchain and crypto projects',
        icon: '₿',
      },
    });

    const realEstateCategory = await prisma.projectCategory.create({
      data: {
        name: 'Real Estate',
        slug: 'real-estate',
        description: 'Property investment opportunities',
        icon: '🏠',
      },
    });

    // 2. Create Users
    console.log('👥 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 12);

    const superAdminUser = await prisma.user.create({
      data: {
        email: 'superadmin@mubinyx.com',
        password: hashedPassword,
        name: 'Super Administrator',
        phone: '+1234567888',
        role: 'SUPER_ADMIN',
        status: 'VERIFIED',
        referralCode: 'SUPERADMIN001',
        emailVerified: true,
      },
    });

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@mubinyx.com',
        password: hashedPassword,
        name: 'Admin User',
        phone: '+1234567890',
        role: 'ADMIN',
        status: 'VERIFIED',
        referralCode: 'ADMIN001',
        emailVerified: true,
      },
    });

    const regularUser1 = await prisma.user.create({
      data: {
        email: 'john@example.com',
        password: hashedPassword,
        name: 'John Doe',
        phone: '+1234567891',
        role: 'USER',
        status: 'VERIFIED',
        referralCode: 'USER001',
        emailVerified: true,
      },
    });

    const regularUser2 = await prisma.user.create({
      data: {
        email: 'jane@example.com',
        password: hashedPassword,
        name: 'Jane Smith',
        phone: '+1234567892',
        role: 'USER',
        status: 'VERIFIED',
        referralCode: 'USER002',
        emailVerified: true,
        referredBy: regularUser1.id,
      },
    });

    // 3. Create Wallets
    console.log('💰 Creating user wallets...');
    await prisma.wallet.create({
      data: {
        userId: superAdminUser.id,
        balance: 1000000.00,
        lockedBalance: 0,
      },
    });

    await prisma.wallet.create({
      data: {
        userId: adminUser.id,
        balance: 50000.00,
        lockedBalance: 0,
      },
    });

    await prisma.wallet.create({
      data: {
        userId: regularUser1.id,
        balance: 25000.00,
        lockedBalance: 5000.00,
      },
    });

    await prisma.wallet.create({
      data: {
        userId: regularUser2.id,
        balance: 15000.00,
        lockedBalance: 3000.00,
      },
    });

    // 4. Create Crypto Networks
    console.log('🌐 Creating crypto networks...');
    const ethereumNetwork = await prisma.cryptoNetwork.create({
      data: {
        name: 'Ethereum',
        symbol: 'ETH',
        chainId: 1,
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_KEY',
        confirmations: 12,
        isActive: true,
      },
    });

    const bscNetwork = await prisma.cryptoNetwork.create({
      data: {
        name: 'Binance Smart Chain',
        symbol: 'BNB',
        chainId: 56,
        rpcUrl: 'https://bsc-dataseed.binance.org/',
        confirmations: 3,
        isActive: true,
      },
    });

    // 5. Create Investment Projects
    console.log('🚀 Creating investment projects...');
    const project1 = await prisma.project.create({
      data: {
        categoryId: techCategory.id,
        name: 'AI-Powered Trading Bot',
        slug: 'ai-trading-bot',
        description: 'Revolutionary AI trading bot that uses machine learning to optimize cryptocurrency trading strategies.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
        minInvestment: 1000.00,
        maxInvestment: 50000.00,
        targetAmount: 500000.00,
        collectedAmount: 325000.00,
        roiPercentage: 15.5,
        durationMonths: 12,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        status: 'ACTIVE',
        riskLevel: 'medium',
      },
    });

    const project2 = await prisma.project.create({
      data: {
        categoryId: cryptoCategory.id,
        name: 'DeFi Yield Farming',
        slug: 'defi-yield-farming',
        description: 'High-yield farming opportunities in decentralized finance protocols.',
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0',
        minInvestment: 500.00,
        maxInvestment: 25000.00,
        targetAmount: 250000.00,
        collectedAmount: 180000.00,
        roiPercentage: 22.0,
        durationMonths: 6,
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-08-01'),
        status: 'ACTIVE',
        riskLevel: 'high',
      },
    });

    console.log('✅ Database seeding completed successfully!');
    console.log('📧 Admin Credentials:');
    console.log('Super Admin: superadmin@mubinyx.com / password123');
    console.log('Admin: admin@mubinyx.com / password123');
    console.log('Test Users: john@example.com, jane@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
