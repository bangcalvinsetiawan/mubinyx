import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, name, phone, referralCode: inputReferralCode } = createUserDto

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new UnauthorizedException('User already exists')
    }

    // Validate referral code if provided
    let referrerUser: any = null
    if (inputReferralCode) {
      referrerUser = await this.prisma.user.findUnique({
        where: { referralCode: inputReferralCode },
      })
      if (!referrerUser) {
        throw new UnauthorizedException('Invalid referral code')
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate unique referral code for new user
    const userReferralCode = this.generateReferralCode()

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        referralCode: userReferralCode,
        referredBy: referrerUser?.id || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        referralCode: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Create wallet for user
    await this.prisma.wallet.create({
      data: {
        userId: user.id,
      },
    })

    // Generate JWT token
    const token = this.jwtService.sign({ 
      sub: user.id, 
      email: user.email,
      role: user.role 
    })

    return {
      user,
      token,
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        password: true,
        role: true,
        status: true,
        referralCode: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Generate JWT token
    const token = this.jwtService.sign({ 
      sub: user.id, 
      email: user.email,
      role: user.role 
    })

    return {
      user: userWithoutPassword,
      token,
    }
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        status: true,
        referralCode: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  }

  private generateReferralCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }
}
