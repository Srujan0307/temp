
import { Injectable, UnauthorizedException, Inject, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { TenantService } from '../tenancy/tenancy.service';
import { User } from '../users/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { ModelClass } from 'objection';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly tenancyService: TenantService,
    @Inject('RefreshTokenModel') private refreshTokenModel: ModelClass<RefreshToken>,
  ) {}

  async login(email: string, pass: string): Promise<any> {
    const tenant = this.tenancyService.getTenant();
    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }

    const user = await this.usersService.findOne(email, tenant.id);
    if (!user || !bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refreshToken(token: string): Promise<any> {
    const refreshToken = await this.refreshTokenModel.query().findOne({ token });
    if (!refreshToken || refreshToken.isRevoked || new Date() > new Date(refreshToken.expiresAt)) {
      if (refreshToken) {
        await this.revokeRefreshTokenFamily(refreshToken);
      }
      throw new ForbiddenException('Invalid refresh token');
    }

    await this.refreshTokenModel.query().patchAndFetchById(refreshToken.id, { isRevoked: true });

    const user = await this.usersService.findById(refreshToken.userId);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    return this.generateTokens(user, refreshToken.token);
  }

  async logout(userId: number): Promise<any> {
    await this.refreshTokenModel.query().where({ userId }).patch({ isRevoked: true });
    return { message: 'Logged out successfully' };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<any> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!bcrypt.compareSync(changePasswordDto.oldPassword, user.password)) {
      throw new BadRequestException('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await User.query().patchAndFetchById(userId, { password: hashedPassword });

    return { message: 'Password changed successfully' };
  }

  private async generateTokens(user: User, oldRefreshToken?: string) {
    const payload = { email: user.email, sub: user.id, tenantId: user.tenantId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.createRefreshToken(user.id, oldRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createRefreshToken(userId: number, oldRefreshToken?: string): Promise<string> {
    const token = randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.refreshTokenModel.query().insert({
      token,
      userId,
      expiresAt: expiresAt.toISOString(),
    } as any);
    
    if (oldRefreshToken) {
      const parent = await this.refreshTokenModel.query().findOne({ token: oldRefreshToken });
      if (parent) {
        await this.refreshTokenModel.query().where({ id: parent.id }).patch({ isRevoked: true });
      }
    }

    return token;
  }
  
  private async revokeRefreshTokenFamily(refreshToken: RefreshToken) {
    await this.refreshTokenModel.query().where({ userId: refreshToken.userId }).patch({ isRevoked: true });
  }
}
