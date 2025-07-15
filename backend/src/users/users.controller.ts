import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Request() req) {
    // Only allow admin or super admin to view all users
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized');
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    // Allow users to view their own profile, or admin to view any profile
    if (req.user.userId !== id && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized');
    }
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Request() req, @Body() createUserDto: any) {
    // Only allow admin or super admin to create users
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized');
    }

    // Super admin can create any role, admin can only create USER and ADMIN
    if (req.user.role === 'ADMIN' && createUserDto.role === 'SUPER_ADMIN') {
      throw new Error('Insufficient permissions to create super admin');
    }

    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateUserDto: any) {
    // Allow users to update their own profile, or admin to update any profile
    if (req.user.userId !== id && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized');
    }

    // Prevent role escalation
    if (updateUserDto.role && req.user.userId === id) {
      throw new Error('Cannot change your own role');
    }

    if (req.user.role === 'ADMIN' && updateUserDto.role === 'SUPER_ADMIN') {
      throw new Error('Insufficient permissions to assign super admin role');
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/status')
  async updateStatus(@Request() req, @Param('id') id: string, @Body() statusDto: { status: string }) {
    // Only allow admin or super admin to change user status
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized');
    }

    // Prevent admin from deactivating themselves
    if (req.user.userId === id) {
      throw new Error('Cannot change your own status');
    }

    return this.usersService.updateStatus(id, statusDto.status);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    // Only allow admin or super admin to delete users
    if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new Error('Unauthorized');
    }

    // Prevent admin from deleting themselves
    if (req.user.userId === id) {
      throw new Error('Cannot delete your own account');
    }

    return this.usersService.remove(id);
  }
}
