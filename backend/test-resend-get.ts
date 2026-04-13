import { Resend } from 'resend';

const resend = new Resend('re_eZNC99dG_6GnFN8ZWGMTaH53iGhrkpZPd');

async function main() {
  // We can't actually get a real email without a valid ID, 
  // but we can check the return type properties if available or 
  // just assume it follows the { data, error } pattern common in their SDK.
  const result = await resend.emails.get('non-existent-id');
  console.log('Keys in result:', Object.keys(result));
  if (result.data) {
    console.log('Keys in data:', Object.keys(result.data));
  } else if (result.error) {
    console.log('Error found as expected');
  }
}

main();
