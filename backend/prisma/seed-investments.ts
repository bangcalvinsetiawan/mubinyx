import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedInvestments() {
  console.log('🌱 Seeding investment projects...');

  // Get existing categories
  const techCategory = await prisma.projectCategory.findFirst({
    where: { slug: 'technology' }
  });
  
  const cryptoCategory = await prisma.projectCategory.findFirst({
    where: { slug: 'cryptocurrency' }
  });
  
  const realEstateCategory = await prisma.projectCategory.findFirst({
    where: { slug: 'real-estate' }
  });

  if (!techCategory || !cryptoCategory || !realEstateCategory) {
    throw new Error('Categories not found. Please run main seed first.');
  }

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.investment.deleteMany({});
  await prisma.investmentTransaction.deleteMany({});
  await prisma.projectUpdate.deleteMany({});
  await prisma.projectReport.deleteMany({});
  await prisma.project.deleteMany({});

  // Technology Projects
  const aiTradingBot = await prisma.project.create({
    data: {
      categoryId: techCategory.id,
      name: 'AI Trading Bot Development',
      slug: 'ai-trading-bot-development',
      description: 'Development of an advanced AI-powered cryptocurrency trading bot with machine learning algorithms for optimal trading decisions. The bot will analyze market patterns, news sentiment, and technical indicators to execute profitable trades automatically.',
      imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800',
      minInvestment: 67, // $67 USD
      maxInvestment: 3333, // $3,333 USD
      targetAmount: 33333, // $33,333 USD
      collectedAmount: 8333, // $8,333 USD collected (25%)
      roiPercentage: 25.5,
      durationMonths: 12,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      status: 'ACTIVE',
      riskLevel: 'medium',
      riskAnalysis: {
        marketRisk: 'medium',
        technicalRisk: 'low',
        regulatoryRisk: 'high',
        competitionRisk: 'medium',
        liquidity: 'high'
      },
      financialData: {
        operatingCosts: 150000000,
        marketingBudget: 75000000,
        developmentCosts: 200000000,
        expectedRevenue: 750000000,
        expectedROI: '25.5%',
        breakEvenPoint: '8 months',
        projectedProfit: 'Rp 127,500,000'
      },
      documents: JSON.stringify([
        { name: 'Business Plan', url: '/docs/ai-bot-business-plan.pdf' },
        { name: 'Technical Whitepaper', url: '/docs/ai-bot-technical.pdf' },
        { name: 'Financial Projections', url: '/docs/ai-bot-financials.xlsx' }
      ])
    }
  });

  const blockchainPlatform = await prisma.project.create({
    data: {
      categoryId: cryptoCategory.id,
      name: 'DeFi Lending Platform',
      slug: 'defi-lending-platform',
      description: 'Decentralized finance platform for peer-to-peer lending with smart contract automation and yield farming opportunities. Users can lend, borrow, and earn rewards through automated market makers.',
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
      minInvestment: 133, // $133 USD
      maxInvestment: 6667, // $6,667 USD
      targetAmount: 66667, // $66,667 USD
      collectedAmount: 20000, // $20,000 USD collected (30%)
      roiPercentage: 18.8,
      durationMonths: 18,
      startDate: new Date('2025-02-01'),
      endDate: new Date('2026-07-31'),
      status: 'ACTIVE',
      riskLevel: 'high',
      riskAnalysis: {
        marketRisk: 'high',
        technicalRisk: 'medium',
        regulatoryRisk: 'high',
        competitionRisk: 'high',
        liquidity: 'medium'
      },
      financialData: {
        operatingCosts: 200000000,
        marketingBudget: 100000000,
        developmentCosts: 300000000,
        expectedRevenue: 1200000000,
        expectedROI: '18.8%',
        breakEvenPoint: '12 months',
        projectedProfit: 'Rp 188,000,000'
      },
      documents: JSON.stringify([
        { name: 'DeFi Protocol Documentation', url: '/docs/defi-protocol.pdf' },
        { name: 'Smart Contract Audit', url: '/docs/smart-contract-audit.pdf' },
        { name: 'Tokenomics', url: '/docs/tokenomics.pdf' }
      ])
    }
  });

  const greenEnergy = await prisma.project.create({
    data: {
      categoryId: techCategory.id,
      name: 'Solar Panel Manufacturing',
      slug: 'solar-panel-manufacturing',
      description: 'High-efficiency solar panel manufacturing facility with cutting-edge photovoltaic technology for sustainable energy solutions. Contributing to Indonesia\'s renewable energy transition.',
      imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
      minInvestment: 333, // $333 USD
      maxInvestment: 13333, // $13,333 USD
      targetAmount: 133333, // $133,333 USD
      collectedAmount: 53333, // $53,333 USD collected (40%)
      roiPercentage: 15.2,
      durationMonths: 24,
      startDate: new Date('2025-03-01'),
      endDate: new Date('2027-02-28'),
      status: 'ACTIVE',
      riskLevel: 'low',
      riskAnalysis: {
        marketRisk: 'low',
        technicalRisk: 'low',
        regulatoryRisk: 'low',
        competitionRisk: 'medium',
        liquidity: 'high'
      },
      financialData: {
        operatingCosts: 500000000,
        marketingBudget: 150000000,
        developmentCosts: 800000000,
        expectedRevenue: 2500000000,
        expectedROI: '15.2%',
        breakEvenPoint: '18 months',
        projectedProfit: 'Rp 304,000,000'
      },
      documents: JSON.stringify([
        { name: 'Environmental Impact Assessment', url: '/docs/solar-environmental.pdf' },
        { name: 'Manufacturing Plan', url: '/docs/solar-manufacturing.pdf' },
        { name: 'Market Analysis', url: '/docs/solar-market.pdf' }
      ])
    }
  });

  const smartCity = await prisma.project.create({
    data: {
      categoryId: realEstateCategory.id,
      name: 'Smart City Residential Complex',
      slug: 'smart-city-residential',
      description: 'Modern residential complex with IoT integration, smart home automation, and sustainable living features in prime urban location. Features include smart parking, energy management, and community facilities.',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      minInvestment: 667, // $667 USD
      maxInvestment: 33333, // $33,333 USD
      targetAmount: 333333, // $333,333 USD
      collectedAmount: 100000, // $100,000 USD collected (30%)
      roiPercentage: 12.5,
      durationMonths: 36,
      startDate: new Date('2025-01-15'),
      endDate: new Date('2028-01-15'),
      status: 'ACTIVE',
      riskLevel: 'low',
      riskAnalysis: {
        marketRisk: 'low',
        technicalRisk: 'low',
        regulatoryRisk: 'low',
        competitionRisk: 'low',
        liquidity: 'high'
      },
      financialData: {
        operatingCosts: 1000000000,
        marketingBudget: 200000000,
        developmentCosts: 3000000000,
        expectedRevenue: 6000000000,
        expectedROI: '12.5%',
        breakEvenPoint: '24 months',
        projectedProfit: 'Rp 625,000,000'
      },
      documents: JSON.stringify([
        { name: 'Architectural Plans', url: '/docs/smart-city-architecture.pdf' },
        { name: 'Environmental Permit', url: '/docs/smart-city-permit.pdf' },
        { name: 'Market Study', url: '/docs/smart-city-market.pdf' }
      ])
    }
  });

  const ecommercePlatform = await prisma.project.create({
    data: {
      categoryId: techCategory.id,
      name: 'E-commerce Platform Expansion',
      slug: 'ecommerce-platform-expansion',
      description: 'Expansion of innovative e-commerce platform across Southeast Asia with AI-powered recommendation engine and logistics optimization. Targeting the growing digital commerce market.',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      minInvestment: 200, // $200 USD
      maxInvestment: 10000, // $10,000 USD
      targetAmount: 100000, // $100,000 USD
      collectedAmount: 30000, // $30,000 USD collected (30%)
      roiPercentage: 22.3,
      durationMonths: 15,
      startDate: new Date('2025-04-01'),
      endDate: new Date('2026-06-30'),
      status: 'ACTIVE',
      riskLevel: 'medium',
      riskAnalysis: {
        marketRisk: 'medium',
        technicalRisk: 'low',
        regulatoryRisk: 'medium',
        competitionRisk: 'high',
        liquidity: 'high'
      },
      financialData: {
        operatingCosts: 400000000,
        marketingBudget: 300000000,
        developmentCosts: 500000000,
        expectedRevenue: 2000000000,
        expectedROI: '22.3%',
        breakEvenPoint: '10 months',
        projectedProfit: 'Rp 334,500,000'
      },
      documents: JSON.stringify([
        { name: 'Market Expansion Strategy', url: '/docs/ecommerce-strategy.pdf' },
        { name: 'Technology Roadmap', url: '/docs/ecommerce-tech.pdf' },
        { name: 'Competitive Analysis', url: '/docs/ecommerce-competition.pdf' }
      ])
    }
  });

  const nftGaming = await prisma.project.create({
    data: {
      categoryId: cryptoCategory.id,
      name: 'NFT Gaming Metaverse',
      slug: 'nft-gaming-metaverse',
      description: 'Revolutionary NFT-based gaming platform with virtual real estate, play-to-earn mechanics, and immersive metaverse experiences. Players can own, trade, and monetize in-game assets.',
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      minInvestment: 100, // $100 USD
      maxInvestment: 5000, // $5,000 USD
      targetAmount: 50000, // $50,000 USD
      collectedAmount: 15000, // $15,000 USD collected (30%)
      roiPercentage: 35.7,
      durationMonths: 20,
      startDate: new Date('2025-05-01'),
      endDate: new Date('2026-12-31'),
      status: 'ACTIVE',
      riskLevel: 'high',
      riskAnalysis: {
        marketRisk: 'high',
        technicalRisk: 'medium',
        regulatoryRisk: 'medium',
        competitionRisk: 'high',
        liquidity: 'medium'
      },
      financialData: {
        operatingCosts: 200000000,
        marketingBudget: 150000000,
        developmentCosts: 300000000,
        expectedRevenue: 1000000000,
        expectedROI: '35.7%',
        breakEvenPoint: '14 months',
        projectedProfit: 'Rp 267,750,000'
      },
      documents: JSON.stringify([
        { name: 'Game Design Document', url: '/docs/nft-game-design.pdf' },
        { name: 'NFT Economics', url: '/docs/nft-economics.pdf' },
        { name: 'Metaverse Roadmap', url: '/docs/metaverse-roadmap.pdf' }
      ])
    }
  });

  const agricultureTech = await prisma.project.create({
    data: {
      categoryId: techCategory.id,
      name: 'AgriTech Smart Farming',
      slug: 'agritech-smart-farming',
      description: 'IoT-based smart farming solutions with precision agriculture, automated irrigation, and crop monitoring systems. Helping farmers increase yield and reduce costs through technology.',
      imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
      minInvestment: 167, // $167 USD
      maxInvestment: 5333, // $5,333 USD
      targetAmount: 53333, // $53,333 USD
      collectedAmount: 13333, // $13,333 USD collected (25%)
      roiPercentage: 16.8,
      durationMonths: 18,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2026-11-30'),
      status: 'ACTIVE',
      riskLevel: 'medium',
      riskAnalysis: {
        marketRisk: 'low',
        technicalRisk: 'medium',
        regulatoryRisk: 'low',
        competitionRisk: 'medium',
        liquidity: 'medium'
      },
      financialData: {
        operatingCosts: 250000000,
        marketingBudget: 100000000,
        developmentCosts: 300000000,
        expectedRevenue: 950000000,
        expectedROI: '16.8%',
        breakEvenPoint: '12 months',
        projectedProfit: 'Rp 134,400,000'
      },
      documents: JSON.stringify([
        { name: 'AgriTech Solution Overview', url: '/docs/agritech-overview.pdf' },
        { name: 'Pilot Project Results', url: '/docs/agritech-pilot.pdf' },
        { name: 'Scalability Plan', url: '/docs/agritech-scale.pdf' }
      ])
    }
  });

  const healthcareTech = await prisma.project.create({
    data: {
      categoryId: techCategory.id,
      name: 'Telemedicine Platform',
      slug: 'telemedicine-platform',
      description: 'Comprehensive telemedicine platform connecting patients with healthcare providers through secure video consultations, AI-assisted diagnosis, and digital health records.',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      minInvestment: 267, // $267 USD
      maxInvestment: 8000, // $8,000 USD
      targetAmount: 80000, // $80,000 USD
      collectedAmount: 24000, // $24,000 USD collected (30%)
      roiPercentage: 19.5,
      durationMonths: 16,
      startDate: new Date('2025-07-01'),
      endDate: new Date('2026-10-31'),
      status: 'ACTIVE',
      riskLevel: 'medium',
      riskAnalysis: {
        marketRisk: 'low',
        technicalRisk: 'medium',
        regulatoryRisk: 'high',
        competitionRisk: 'medium',
        liquidity: 'high'
      },
      financialData: {
        operatingCosts: 300000000,
        marketingBudget: 200000000,
        developmentCosts: 400000000,
        expectedRevenue: 1400000000,
        expectedROI: '19.5%',
        breakEvenPoint: '11 months',
        projectedProfit: 'Rp 234,000,000'
      },
      documents: JSON.stringify([
        { name: 'Healthcare Compliance', url: '/docs/healthcare-compliance.pdf' },
        { name: 'Technology Architecture', url: '/docs/telemedicine-tech.pdf' },
        { name: 'Market Research', url: '/docs/healthcare-market.pdf' }
      ])
    }
  });

  console.log('✅ Investment projects seeded successfully!');
  console.log(`Created projects:
    - ${aiTradingBot.name}
    - ${blockchainPlatform.name}
    - ${greenEnergy.name}
    - ${smartCity.name}
    - ${ecommercePlatform.name}
    - ${nftGaming.name}
    - ${agricultureTech.name}
    - ${healthcareTech.name}
  `);

  return {
    aiTradingBot,
    blockchainPlatform,
    greenEnergy,
    smartCity,
    ecommercePlatform,
    nftGaming,
    agricultureTech,
    healthcareTech
  };
}

if (require.main === module) {
  seedInvestments()
    .then(() => {
      console.log('✅ Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
