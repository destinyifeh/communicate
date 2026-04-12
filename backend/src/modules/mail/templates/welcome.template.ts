import { baseTemplate } from './base.template';

interface WelcomeEmailProps {
  firstName: string;
  businessName: string;
  loginUrl: string;
}

export function welcomeEmailTemplate({ firstName, businessName, loginUrl }: WelcomeEmailProps): string {
  const content = `
    <h2>Welcome to Communicate!</h2>
    <p>Hi ${firstName},</p>
    <p>Your account for <strong>${businessName}</strong> is now ready. You can start managing your customer communications right away.</p>
    <div style="text-align: center;">
      <a href="${loginUrl}" class="button">Go to Dashboard</a>
    </div>
    <p>Here's what you can do with Communicate:</p>
    <ul style="margin: 16px 0; padding-left: 24px; color: #3f3f46;">
      <li style="margin-bottom: 8px;">Manage customer conversations via SMS and WhatsApp</li>
      <li style="margin-bottom: 8px;">Handle bookings and appointments</li>
      <li style="margin-bottom: 8px;">Run marketing campaigns</li>
      <li style="margin-bottom: 8px;">Track inquiries and support requests</li>
    </ul>
    <p>If you have any questions, our support team is here to help.</p>
  `;

  return baseTemplate(content, `Welcome to Communicate, ${firstName}!`);
}
