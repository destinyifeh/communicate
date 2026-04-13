import { Resend } from 'resend';

const resend = new Resend('re_eZNC99dG_6GnFN8ZWGMTaH53iGhrkpZPd');

async function main() {
  console.log('Methods of resend.emails.receiving:', Object.getOwnPropertyNames(Object.getPrototypeOf((resend.emails as any).receiving)));
}

main();
