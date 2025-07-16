import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

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

  // Create Super Admin first
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

  const regularUser3 = await prisma.user.create({
    data: {
      email: 'mike@example.com',
      password: hashedPassword,
      name: 'Mike Johnson',
      phone: '+1234567893',
      role: 'USER',
      status: 'PENDING',
      referralCode: 'USER003',
      emailVerified: false,
    },
  });

  // 3. Create Wallets for users
  console.log('💰 Creating user wallets...');
  
  // Create wallet for Super Admin
  await prisma.wallet.create({
    data: {
      userId: superAdminUser.id,
      balance: 1000000.00, // $1,000,000 for super admin
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

  await prisma.wallet.create({
    data: {
      userId: regularUser3.id,
      balance: 1000.00,
      lockedBalance: 0,
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

  const polygonNetwork = await prisma.cryptoNetwork.create({
    data: {
      name: 'Polygon',
      symbol: 'MATIC',
      chainId: 137,
      rpcUrl: 'https://polygon-rpc.com/',
      confirmations: 10,
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
      riskAnalysis: {
        marketRisk: 'Medium',
        technicalRisk: 'Low',
        regulatoryRisk: 'Low',
        liquidity: 'High'
      },
      financialData: {
        expectedROI: '15.5%',
        breakEvenPoint: '8 months',
        projectedProfit: '$77,500'
      },
      documents: JSON.stringify([
        { name: 'Business Plan', url: '/docs/ai-bot-business-plan.pdf' },
        { name: 'Technical Whitepaper', url: '/docs/ai-bot-technical.pdf' }
      ]),
    },
  });

  const project2 = await prisma.project.create({
    data: {
      categoryId: cryptoCategory.id,
      name: 'DeFi Yield Farm',
      slug: 'defi-yield-farm',
      description: 'Decentralized finance yield farming protocol with automated liquidity provision.',
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0',
      minInvestment: 500.00,
      maxInvestment: 25000.00,
      targetAmount: 1000000.00,
      collectedAmount: 750000.00,
      roiPercentage: 22.8,
      durationMonths: 18,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2026-06-01'),
      status: 'ACTIVE',
      riskLevel: 'high',
      riskAnalysis: {
        marketRisk: 'High',
        technicalRisk: 'Medium',
        regulatoryRisk: 'High',
        liquidity: 'Medium'
      },
      financialData: {
        expectedROI: '22.8%',
        breakEvenPoint: '10 months',
        projectedProfit: '$228,000'
      },
      documents: JSON.stringify([
        { name: 'Smart Contract Audit', url: '/docs/defi-audit.pdf' },
        { name: 'Tokenomics', url: '/docs/defi-tokenomics.pdf' }
      ]),
    },
  });

  const project3 = await prisma.project.create({
    data: {
      categoryId: realEstateCategory.id,
      name: 'Luxury Resort Development',
      slug: 'luxury-resort-bali',
      description: 'Premium resort development in Bali with sustainable architecture and modern amenities.',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      minInvestment: 10000.00,
      maxInvestment: 100000.00,
      targetAmount: 2000000.00,
      collectedAmount: 450000.00,
      roiPercentage: 12.5,
      durationMonths: 24,
      startDate: new Date('2025-03-01'),
      endDate: new Date('2027-03-01'),
      status: 'ACTIVE',
      riskLevel: 'low',
      riskAnalysis: {
        marketRisk: 'Low',
        technicalRisk: 'Low',
        regulatoryRisk: 'Medium',
        liquidity: 'Medium'
      },
      financialData: {
        expectedROI: '12.5%',
        breakEvenPoint: '18 months',
        projectedProfit: '$250,000'
      },
      documents: JSON.stringify([
        { name: 'Property Deed', url: '/docs/resort-deed.pdf' },
        { name: 'Construction Plans', url: '/docs/resort-plans.pdf' },
        { name: 'Environmental Impact', url: '/docs/resort-environmental.pdf' }
      ]),
    },
  });

  // 6. Create Investments
  console.log('💼 Creating investments...');
  const investment1 = await prisma.investment.create({
    data: {
      userId: regularUser1.id,
      projectId: project1.id,
      amount: 15000.00,
      expectedReturn: 17325.00,
      startDate: new Date('2025-01-15'),
      maturityDate: new Date('2026-01-15'),
      status: 'active',
    },
  });

  const investment2 = await prisma.investment.create({
    data: {
      userId: regularUser1.id,
      projectId: project2.id,
      amount: 8000.00,
      expectedReturn: 9824.00,
      startDate: new Date('2025-01-10'),
      maturityDate: new Date('2026-07-10'),
      status: 'active',
    },
  });

  const investment3 = await prisma.investment.create({
    data: {
      userId: regularUser2.id,
      projectId: project1.id,
      amount: 5000.00,
      expectedReturn: 5775.00,
      startDate: new Date('2025-01-20'),
      maturityDate: new Date('2026-01-20'),
      status: 'active',
    },
  });

  const investment4 = await prisma.investment.create({
    data: {
      userId: regularUser2.id,
      projectId: project3.id,
      amount: 25000.00,
      expectedReturn: 28125.00,
      startDate: new Date('2025-03-01'),
      maturityDate: new Date('2027-03-01'),
      status: 'active',
    },
  });

  // 7. Create Transactions
  console.log('💳 Creating transactions...');
  await prisma.transaction.create({
    data: {
      userId: regularUser1.id,
      code: 'TXN001',
      type: 'INVESTMENT',
      amount: 15000.00,
      status: 'COMPLETED',
    },
  });

  await prisma.transaction.create({
    data: {
      userId: regularUser1.id,
      code: 'TXN002',
      type: 'INVESTMENT',
      amount: 8000.00,
      status: 'COMPLETED',
    },
  });

  await prisma.transaction.create({
    data: {
      userId: regularUser2.id,
      code: 'TXN003',
      type: 'DEPOSIT',
      amount: 50000.00,
      status: 'COMPLETED',
    },
  });

  await prisma.transaction.create({
    data: {
      userId: regularUser2.id,
      code: 'TXN004',
      type: 'INVESTMENT',
      amount: 5000.00,
      status: 'COMPLETED',
    },
  });

  await prisma.transaction.create({
    data: {
      userId: regularUser3.id,
      code: 'TXN005',
      type: 'DEPOSIT',
      amount: 1000.00,
      status: 'PENDING',
    },
  });

  // 8. Create Project Updates
  console.log('📢 Creating project updates...');
  await prisma.projectUpdate.create({
    data: {
      projectId: project1.id,
      title: 'Development Milestone Reached',
      content: 'We have successfully completed the core AI algorithm development. The trading bot is now showing excellent performance in backtesting with 15.5% returns.',
      attachments: JSON.stringify([
        { name: 'Performance Report Q1', url: '/updates/ai-bot-q1-report.pdf' }
      ]),
    },
  });

  await prisma.projectUpdate.create({
    data: {
      projectId: project2.id,
      title: 'Smart Contract Deployment',
      content: 'Our DeFi yield farming smart contracts have been successfully deployed on mainnet after passing comprehensive security audits.',
      attachments: JSON.stringify([
        { name: 'Smart Contract Address', url: '/updates/defi-contract-address.txt' },
        { name: 'Audit Report', url: '/updates/defi-audit-final.pdf' }
      ]),
    },
  });

  await prisma.projectUpdate.create({
    data: {
      projectId: project3.id,
      title: 'Construction Phase Begins',
      content: 'Ground breaking ceremony completed successfully. Construction of the luxury resort has officially begun with expected completion in 24 months.',
      attachments: JSON.stringify([
        { name: 'Construction Photos', url: '/updates/resort-construction-photos.zip' },
        { name: 'Timeline Update', url: '/updates/resort-timeline.pdf' }
      ]),
    },
  });

  // 9. Create Notifications
  console.log('🔔 Creating notifications...');
  await prisma.notification.create({
    data: {
      userId: regularUser1.id,
      title: 'Investment Successful',
      message: 'Your investment of $15,000 in AI Trading Bot has been confirmed.',
      type: 'success',
      data: { investmentId: investment1.id, amount: 15000 },
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: regularUser2.id,
      title: 'Project Update Available',
      message: 'New update available for Luxury Resort Development project.',
      type: 'info',
      data: { projectId: project3.id },
      isRead: true,
      readAt: new Date(),
    },
  });

  await prisma.notification.create({
    data: {
      userId: regularUser1.id,
      title: 'ROI Payment Received',
      message: 'You have received $1,250 as quarterly ROI from AI Trading Bot.',
      type: 'success',
      data: { amount: 1250, projectId: project1.id },
      isRead: false,
    },
  });

  // 10. Create CMS Content
  console.log('📝 Creating CMS content...');
  await prisma.cmsSettings.createMany({
    data: [
      {
        key: 'site_name',
        value: 'Mubinyx',
        type: 'text',
        group: 'general',
      },
      {
        key: 'site_description',
        value: 'The Future of Investment - Powered by Blockchain Technology',
        type: 'text',
        group: 'general',
      },
      {
        key: 'contact_email',
        value: 'support@mubinyx.com',
        type: 'text',
        group: 'contact',
      },
      {
        key: 'twitter_url',
        value: 'https://twitter.com/mubinyx',
        type: 'text',
        group: 'social',
      },
      {
        key: 'telegram_url',
        value: 'https://t.me/mubinyx',
        type: 'text',
        group: 'social',
      },
    ],
  });

  await prisma.cmsContent.createMany({
    data: [
      {
        section: 'hero',
        title: 'Invest in the Future',
        content: 'Discover exclusive investment opportunities in technology, cryptocurrency, and real estate.',
        data: {
          buttonText: 'Start Investing',
          backgroundImage: '/images/hero-bg.jpg'
        },
        order: 1,
        isActive: true,
      },
      {
        section: 'features',
        title: 'Why Choose Mubinyx',
        content: 'Secure, transparent, and profitable investment platform.',
        data: {
          features: [
            { icon: '🔒', title: 'Secure', description: 'Bank-level security' },
            { icon: '📊', title: 'Transparent', description: 'Real-time reporting' },
            { icon: '💰', title: 'Profitable', description: 'High ROI projects' }
          ]
        },
        order: 2,
        isActive: true,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('- 3 Project Categories');
  console.log('- 5 Users (1 Super Admin, 1 Admin, 3 Regular)');
  console.log('- 5 User Wallets');
  console.log('- 3 Crypto Networks');
  console.log('- 3 Investment Projects');
  console.log('- 4 Investments');
  console.log('- 5 Transactions');
  console.log('- 3 Project Updates');
  console.log('- 3 Notifications');
  console.log('- CMS Settings & Content');
  console.log('');
  console.log('🔑 Test Accounts:');
  console.log('- Super Admin: superadmin@mubinyx.com / password123 ($1,000,000)');
  console.log('- Admin: admin@mubinyx.com / password123 ($50,000)');
  console.log('- User 1: john@example.com / password123');
  console.log('- User 2: jane@example.com / password123');
  console.log('- User 3: mike@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
