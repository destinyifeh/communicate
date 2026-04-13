import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  Request,
  Response,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user and business' })
  @ApiResponse({ status: 201, description: 'User and business created successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(
    @Body() registerDto: RegisterDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const result = await this.authService.register(registerDto);

    // Set access token as HTTP-only cookie
    // In development, we need sameSite: 'lax' for cross-port requests on localhost
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return result;
  }

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user (simplified for frontend)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async signup(
    @Body() body: {
      email: string;
      password: string;
      name: string;
      role?: string;
      businessName?: string;
      businessSlug?: string;
      features?: string[];
    },
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    // Parse name into first and last name
    const nameParts = body.name.trim().split(' ');
    const firstName = nameParts[0] || body.name;
    const lastName = nameParts.slice(1).join(' ') || '';

    // Map frontend feature names to backend FeatureType enum
    const featureMap: Record<string, string> = {
      'booking': 'BOOKING',
      'inquiries': 'INQUIRIES',
      'support': 'SUPPORT',
      'marketing': 'MARKETING',
    };

    const features = (body.features || ['booking', 'inquiries'])
      .map(f => featureMap[f.toLowerCase()] || f.toUpperCase())
      .filter(Boolean);

    const registerDto: RegisterDto = {
      email: body.email,
      password: body.password,
      firstName,
      lastName,
      businessName: body.businessName || body.name,
      features: features as any,
    };

    const result = await this.authService.register(registerDto);

    // Set access token as HTTP-only cookie
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return user in format expected by frontend
    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: `${result.user.firstName} ${result.user.lastName}`.trim(),
        role: body.role || 'client',
        businessName: body.businessName,
        businessSlug: body.businessSlug,
        emailVerified: result.user.emailVerified,
      },
      accessToken: result.accessToken,
      requiresVerification: result.requiresVerification,
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const result = await this.authService.login(loginDto);

    // Set access token as HTTP-only cookie
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return user in format expected by frontend
    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        name: `${result.user.firstName} ${result.user.lastName}`.trim(),
        role: result.user.role === 'ADMIN' ? 'admin' : 'client',
        businessName: result.business?.name,
        businessSlug: result.business?.id ? this.generateSlug(result.business.name) : undefined,
      },
      accessToken: result.accessToken,
    };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and clear session' })
  async logout(@Response({ passthrough: true }) res: ExpressResponse) {
    res.clearCookie('access_token');
    return { success: true };
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email with OTP code' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification code' })
  async verifyEmail(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyEmail(body.email, body.otp);
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  async resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerificationEmail(body.email);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Reset email sent if account exists' })
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() body: { email: string; token: string; password: string }) {
    return this.authService.resetPassword(body.email, body.token, body.password);
  }

  @Public()
  @Get('session')
  @ApiOperation({ summary: 'Get current session from cookie' })
  async getSession(@Request() req: any) {
    const token = req.cookies?.access_token;
    if (!token) {
      return { user: null };
    }

    try {
      const user = await this.authService.validateUserFromToken(token);
      if (!user) {
        return { user: null };
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`.trim(),
          role: user.role === 'ADMIN' ? 'admin' : 'client',
          businessName: user.currentBusiness?.name,
          businessSlug: user.currentBusiness ? this.generateSlug(user.currentBusiness.name) : undefined,
        },
      };
    } catch {
      return { user: null };
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const result = await this.authService.refreshToken(refreshTokenDto.refreshToken);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: any) {
    const user = req.user;
    return {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
      currentBusiness: user.currentBusiness
        ? {
            id: user.currentBusiness.id,
            name: user.currentBusiness.name,
          }
        : null,
    };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @Request() req: any,
    @Body() body: {
      businessName?: string;
      businessSlug?: string;
      businessLogo?: string;
      brandColor?: string;
    },
  ) {
    const user = req.user;

    if (user.currentBusiness && (body.businessName || body.businessLogo || body.brandColor)) {
      await this.authService.updateBusiness(user.currentBusiness.id, {
        name: body.businessName,
        logoUrl: body.businessLogo,
        brandColor: body.brandColor,
        slug: body.businessSlug,
      });
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        businessName: body.businessName || user.currentBusiness?.name,
        businessSlug: body.businessSlug,
        businessLogo: body.businessLogo,
        brandColor: body.brandColor,
      },
    };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
