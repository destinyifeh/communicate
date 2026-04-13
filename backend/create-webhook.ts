import { Resend } from 'resend';

const resend = new Resend('re_eZNC99dG_6GnFN8ZWGMTaH53iGhrkpZPd');

async function main() {
  try {
    const { data, error } = await resend.webhooks.create({
      endpoint: 'https://5624-105-113-70-69.ngrok-free.app/api/email/webhook/inbound?businessId=5023d4b6-6f43-4c47-ae28-31c2e43e5e7e',
      events: ['email.received'],
    });

    if (error) {
      console.error('Error creating webhook:', error);
    } else {
      console.log('Successfully created webhook:', data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

main();
