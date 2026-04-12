import { baseTemplate } from './base.template';

interface VerificationEmailProps {
  firstName: string;
  otp: string;
}

export function verificationEmailTemplate({ firstName, otp }: VerificationEmailProps): string {
  const content = `
    <h2>Welcome to Communicate, ${firstName}!</h2>
    <p>Thanks for signing up. Please verify your email address by entering the code below:</p>
    <div class="otp-code">
      <span>${otp}</span>
    </div>
    <p>This code expires in <strong>10 minutes</strong>.</p>
    <p class="muted">If you didn't create an account with Communicate, you can safely ignore this email.</p>
  `;

  return baseTemplate(content, `Your verification code is ${otp}`);
}
