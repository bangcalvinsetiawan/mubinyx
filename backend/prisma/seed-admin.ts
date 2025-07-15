import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdminUsers() {
  console.log('🔥 Creating Admin and Super Admin users...');

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create Super Admin
    const superAdmin = await prisma.user.upsert({
      where: { email: 'superadmin@mubinyx.com' },
      update: {},
      create: {
        email: 'superadmin@mubinyx.com',
        password: hashedPassword,
        name: 'Super Administrator',
        phone: '+1234567890',
        role: 'SUPER_ADMIN',
        status: 'VERIFIED',
        emailVerified: true,
        referralCode: 'SUPERADMIN001',
      }
    });

    // Create wallet for Super Admin
    await prisma.wallet.upsert({
      where: { userId: superAdmin.id },
      update: {},
      create: {
        userId: superAdmin.id,
        balance: 1000000, // $1,000,000 starting balance
        lockedBalance: 0,
      }
    });

    // Create Admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@mubinyx.com' },
      update: {},
      create: {
        email: 'admin@mubinyx.com',
        password: hashedPassword,
        name: 'Platform Administrator',
        phone: '+1234567891',
        role: 'ADMIN',
        status: 'VERIFIED',
        emailVerified: true,
        referralCode: 'ADMIN001',
      }
    });

    // Create wallet for Admin
    await prisma.wallet.upsert({
      where: { userId: admin.id },
      update: {},
      create: {
        userId: admin.id,
        balance: 500000, // $500,000 starting balance
        lockedBalance: 0,
      }
    });

    // Create additional regular admins
    const adminUsers = [
      {
        email: 'admin.finance@mubinyx.com',
        name: 'Finance Administrator',
        phone: '+1234567892',
        referralCode: 'FINADMIN001',
        balance: 250000
      },
      {
        email: 'admin.operations@mubinyx.com',
        name: 'Operations Administrator',
        phone: '+1234567893',
        referralCode: 'OPSADMIN001',
        balance: 250000
      }
    ];

    for (const adminUser of adminUsers) {
      const user = await prisma.user.upsert({
        where: { email: adminUser.email },
        update: {},
        create: {
          email: adminUser.email,
          password: hashedPassword,
          name: adminUser.name,
          phone: adminUser.phone,
          role: 'ADMIN',
          status: 'VERIFIED',
          emailVerified: true,
          referralCode: adminUser.referralCode,
        }
      });

      // Create wallet for admin
      await prisma.wallet.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          balance: adminUser.balance,
          lockedBalance: 0,
        }
      });
    }

    console.log('✅ Admin users created successfully!');
    console.log('');
    console.log('🔑 Login Credentials:');
    console.log('Super Admin: superadmin@mubinyx.com / admin123');
    console.log('Admin: admin@mubinyx.com / admin123');
    console.log('Finance Admin: admin.finance@mubinyx.com / admin123');
    console.log('Operations Admin: admin.operations@mubinyx.com / admin123');
    
  } catch (error) {
    console.error('❌ Error creating admin users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Enhanced user correlation seed
async function createUserCorrelationData() {
  console.log('📊 Creating user correlation data...');

  try {
    // Get all users
    const users = await prisma.user.findMany();
    
    // Create additional investments for correlation
    const projects = await prisma.project.findMany();
    
    for (const user of users) {
      if (user.role === 'USER') {
        // Create 2-4 random investments per user
        const investmentCount = Math.floor(Math.random() * 3) + 2;
        
        for (let i = 0; i < investmentCount; i++) {
          const randomProject = projects[Math.floor(Math.random() * projects.length)];
          const investmentAmount = Math.floor(Math.random() * 50000) + 10000; // $10k - $60k
          
          const investment = await prisma.investment.create({
            data: {
              userId: user.id,
              projectId: randomProject.id,
              amount: investmentAmount,
              expectedReturn: investmentAmount * (1 + Number(randomProject.roiPercentage) / 100),
              startDate: new Date(),
              maturityDate: new Date(Date.now() + randomProject.durationMonths * 30 * 24 * 60 * 60 * 1000),
              status: ['active', 'completed', 'cancelled'][Math.floor(Math.random() * 3)]
            }
          });

          // Create investment transaction
          const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
          if (wallet) {
            await prisma.walletTransaction.create({
              data: {
                userId: user.id,
                walletId: wallet.id,
                type: 'INVESTMENT',
                amount: investmentAmount,
                status: 'COMPLETED',
                description: `Investment in ${randomProject.name}`,
                referenceType: 'investment',
                referenceId: investment.id
              }
            });
          }
        }

        // Create some wallet transactions
        const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
        if (wallet) {
          // Random top-ups
          for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
            await prisma.walletTransaction.create({
              data: {
                userId: user.id,
                walletId: wallet.id,
                type: 'DEPOSIT',
                amount: Math.floor(Math.random() * 100000) + 20000,
                status: ['PENDING', 'COMPLETED', 'FAILED'][Math.floor(Math.random() * 3)],
                description: 'Bank transfer deposit',
                metadata: JSON.stringify({
                  paymentMethod: 'bank_transfer',
                  paymentReference: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`
                })
              }
            });
          }

          // Update wallet balance
          const totalInvestments = await prisma.investment.aggregate({
            where: { userId: user.id },
            _sum: { amount: true }
          });

          const newBalance = Math.floor(Math.random() * 100000) + 50000;
          await prisma.wallet.update({
            where: { id: wallet.id },
            data: {
              balance: newBalance,
              lockedBalance: Math.floor(Math.random() * 20000)
            }
          });
        }
      }
    }

    console.log('✅ User correlation data created!');
    
  } catch (error) {
    console.error('❌ Error creating correlation data:', error);
  }
}

async function main() {
  await createAdminUsers();
  await createUserCorrelationData();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
