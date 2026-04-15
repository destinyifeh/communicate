# Communicate Backend

Multi-tenant communication SaaS platform backend built with NestJS and Prisma.

## Features

- **Multi-channel messaging**: SMS, WhatsApp, Voice, and Email
- **Email integration**: Powered by Resend
- **SMS/Voice**: Powered by Twilio
- **Multi-tenant**: Each business has isolated data and configurations
- **Unified inbox**: All channels appear in one inbox
- **AI-powered routing**: Intent detection and automatic responses

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Docker (optional, for local database)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example environment file:

```bash
cp .env.example .env
```

Update the values in `.env`:

```env
DATABASE_URL=postgresql://communicate:communicate_dev_password@localhost:5432/communicate

```

### 3. Start the database

Using Docker:

```bash
npm run docker:db
```

Or use your own PostgreSQL instance.

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. Generate Prisma client

```bash
npm run db:generate
```

### 6. Start the development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001`.

## API Documentation

Swagger documentation is available at `http://localhost:3001/api` when the server is running.

## Database Commands

| Command                   | Description                           |
| ------------------------- | ------------------------------------- |
| `npm run db:generate`     | Generate Prisma client                |
| `npm run db:migrate`      | Run migrations (development)          |
| `npm run db:migrate:prod` | Run migrations (production)           |
| `npm run db:push`         | Push schema changes without migration |
| `npm run db:studio`       | Open Prisma Studio GUI                |

## Project Structure

```
src/
├── common/           # Shared utilities, guards, decorators
├── prisma/           # Prisma module and service
└── modules/
    ├── auth/         # Authentication (JWT)
    ├── billing/      # Subscription & billing
    ├── booking/      # Appointment booking
    ├── business/     # Business management
    ├── campaigns/    # Marketing campaigns
    ├── email/        # Resend email integration
    ├── inquiry/      # Inquiry handling & routing
    ├── messaging/    # Unified messaging
    ├── support/      # Support ticket management
    ├── twilio/       # Twilio SMS/Voice integration
    └── users/        # User management
```

## Webhook Configuration

### Resend (Email)

Configure these webhook URLs in your Resend dashboard:

- **Inbound emails**: `{YOUR_URL}/api/email/webhook/inbound?businessId={BUSINESS_ID}`
- **Email status**: `{YOUR_URL}/api/email/webhook/status`

### Twilio (SMS/Voice)

Configure these webhook URLs in your Twilio console:

- **SMS**: `{YOUR_URL}/api/twilio/webhook/sms?businessId={BUSINESS_ID}`
- **Voice**: `{YOUR_URL}/api/twilio/webhook/voice?businessId={BUSINESS_ID}`
