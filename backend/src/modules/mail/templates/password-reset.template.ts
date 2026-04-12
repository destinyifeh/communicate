import { baseTemplate } from './base.template';

interface PasswordResetEmailProps {
  firstName: string;
  resetUrl: string;
  otp?: string;
}

export function passwordResetEmailTemplate({ firstName, resetUrl, otp }: PasswordResetEmailProps): string {
  const content = `
    <h2>Reset your password</h2>
    <p>Hi ${firstName},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    ${otp ? `
    <p>Or enter this code manually:</p>
    <div class="otp-code">
      <span>${otp}</span>
    </div>
    ` : ''}
    <p>This link expires in <strong>1 hour</strong>.</p>
    <p class="muted">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
  `;

  return baseTemplate(content, 'Reset your Communicate password');
}
