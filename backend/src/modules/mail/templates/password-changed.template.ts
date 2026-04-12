import { baseTemplate } from './base.template';

interface PasswordChangedEmailProps {
  firstName: string;
}

export function passwordChangedEmailTemplate({ firstName }: PasswordChangedEmailProps): string {
  const content = `
    <h2>Password changed successfully</h2>
    <p>Hi ${firstName},</p>
    <p>Your password has been successfully changed. You can now log in with your new password.</p>
    <p class="muted">If you didn't make this change, please contact our support team immediately or reset your password.</p>
  `;

  return baseTemplate(content, 'Your password has been changed');
}
