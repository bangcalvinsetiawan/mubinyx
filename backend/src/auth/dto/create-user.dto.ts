import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsString()
  name: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  referralCode?: string
}
