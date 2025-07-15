import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkData() {
  console.log('🔍 Checking database data...')
  
  // Check investments
  const investments = await prisma.investment.findMany({
    include: {
      user: true,
      project: true
    }
  })
  
  console.log('📊 Investments found:', investments.length)
  console.log('💰 Investment details:')
  investments.forEach(inv => {
    console.log(`- ${inv.user.name}: $${inv.amount} in ${inv.project.name}`)
  })
  
  // Calculate total
  const totalAmount = investments.reduce((sum, inv) => sum + Number(inv.amount), 0)
  console.log('\n🧮 Total Investment Amount:', `$${totalAmount.toLocaleString()}`)
  
  // Check projects
  const projects = await prisma.project.findMany({
    where: { status: 'ACTIVE' }
  })
  
  console.log('\n🏗️ Active Projects:', projects.length)
  projects.forEach(proj => {
    console.log(`- ${proj.name}: Target $${Number(proj.targetAmount).toLocaleString()}`)
  })
  
  // Check users
  const users = await prisma.user.findMany()
  console.log('\n👥 Total Users:', users.length)
  
  // Check wallets
  const wallets = await prisma.wallet.findMany({
    include: { user: true }
  })
  
  console.log('\n💳 Wallet Balances:')
  wallets.forEach(wallet => {
    console.log(`- ${wallet.user.name}: $${Number(wallet.balance).toLocaleString()}`)
  })
  
  await prisma.$disconnect()
}

checkData().catch(console.error)
