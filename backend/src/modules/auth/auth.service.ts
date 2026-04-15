import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma';
import { MailService } from '../mail';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import {
  UserRole,
  FeatureType,
  SubscriptionPlan,
  SubscriptionStatus,
  User,
} from '../../generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, businessName, phone, features } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate 6-digit OTP
    const otp = this.generateOtp();

    // Create user with verification token
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: UserRole.OWNER,
        emailVerificationToken: otp,
        emailVerified: false,
      },
    });

    // Create business
    const business = await this.prisma.business.create({
      data: {
        name: businessName,
        ownerId: user.id,
        email,
        phone,
      },
    });

    // Set user's current business
    await this.prisma.user.update({
      where: { id: user.id },
      data: { currentBusinessId: business.id },
    });

    // Create features
    await this.prisma.businessFeature.createMany({
      data: features.map((featureType) => ({
        featureType,
        enabled: true,
        businessId: business.id,
      })),
    });

    // Determine subscription plan based on features
    const plan = this.determinePlanFromFeatures(features);

    // Create subscription
    await this.prisma.subscription.create({
      data: {
        plan,
        status: SubscriptionStatus.ACTIVE,
        businessId: business.id,
        maxPhoneNumbers: this.getPlanPhoneLimit(plan),
        maxMessagesPerMonth: this.getPlanMessageLimit(plan),
        monthlyPrice: this.getPlanPrice(plan),
        currency: 'USD',
      },
    });

    // Send verification email
    const res = await this.mailService.sendVerificationEmail(email, firstName, otp);
  
    // Generate tokens
    const tokens = await this.generateTokens(user, business.id);

    return {
      user: this.sanitizeUser(user),
      business: {
        id: business.id,
        name: business.name,
      },
      features: features,
      subscription: {
        plan,
        price: this.getPlanPrice(plan),
      },
      requiresVerification: true,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        currentBusiness: {
          include: {
            features: true,
            subscription: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user, user.currentBusinessId);

    return {
      user: this.sanitizeUser(user),
      business: user.currentBusiness
        ? {
            id: user.currentBusiness.id,
            name: user.currentBusiness.name,
            features: user.currentBusiness.features?.map((f) => f.featureType) || [],
            subscription: user.currentBusiness.subscription
              ? {
                  plan: user.currentBusiness.subscription.plan,
                  status: user.currentBusiness.subscription.status,
                }
              : null,
          }
        : null,
      ...tokens,
    };
  }

  async verifyEmail(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { currentBusiness: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    if (user.emailVerificationToken !== otp) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
    });

    // Send welcome email
    if (user.currentBusiness) {
      await this.mailService.sendWelcomeEmail(email, user.firstName, user.currentBusiness.name);
    }

    return {
      success: true,
      message: 'Email verified successfully',
      user: this.sanitizeUser(user),
    };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new OTP
    const otp = this.generateOtp();

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: otp },
    });

    await this.mailService.sendVerificationEmail(email, user.firstName, otp);

    return { success: true, message: 'Verification email sent' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('Email not found');
    }

    // Generate reset token (6-digit OTP for simplicity)
    const resetToken = this.generateOtp();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    await this.mailService.sendPasswordResetEmail(email, user.firstName, resetToken);

    return { success: true, message: 'Password reset code sent to your email' };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (!user.passwordResetToken || user.passwordResetToken !== token) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from your current password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    // Send confirmation email
    await this.mailService.sendPasswordChangedEmail(email, user.firstName);

    return { success: true, message: 'Password reset successfully' };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id: userId, isActive: true },
      include: { currentBusiness: true },
    });
  }

  async validateUserFromToken(token: string): Promise<any | null> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { currentBusiness: true },
      });

      if (!user || !user.isActive) {
        return null;
      }

      return user;
    } catch {
      return null;
    }
  }

  async updateBusiness(businessId: string, data: {
    name?: string;
    logoUrl?: string;
    brandColor?: string;
    slug?: string;
  }) {
    return this.prisma.business.update({
      where: { id: businessId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.logoUrl && { logoUrl: data.logoUrl }),
        ...(data.brandColor && { brandColor: data.brandColor }),
        ...(data.slug && { slug: data.slug }),
      },
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid token');
      }

      return this.generateTokens(user, user.currentBusinessId);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(user: User, businessId?: string | null) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      businessId: businessId || undefined,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '1h' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
    };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private determinePlanFromFeatures(features: FeatureType[]): SubscriptionPlan {
    const hasMarketing = features.includes(FeatureType.MARKETING);
    const hasSupport = features.includes(FeatureType.SUPPORT);

    if (hasMarketing) {
      return SubscriptionPlan.PRO;
    }
    if (hasSupport) {
      return SubscriptionPlan.GROWTH;
    }
    return SubscriptionPlan.STARTER;
  }

  private getPlanPhoneLimit(plan: SubscriptionPlan): number {
    switch (plan) {
      case SubscriptionPlan.PRO:
        return 5;
      case SubscriptionPlan.GROWTH:
        return 2;
      default:
        return 1;
    }
  }

  private getPlanMessageLimit(plan: SubscriptionPlan): number {
    switch (plan) {
      case SubscriptionPlan.PRO:
        return 2000;
      case SubscriptionPlan.GROWTH:
        return 500;
      default:
        return 100;
    }
  }

  private getPlanPrice(plan: SubscriptionPlan): number {
    switch (plan) {
      case SubscriptionPlan.PRO:
        return 149;
      case SubscriptionPlan.GROWTH:
        return 79;
      default:
        return 29;
    }
  }
}
