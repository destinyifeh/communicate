import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filters";
import { LoggingInterceptor } from "./common/interceptors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Cookie parser for session management
  app.use(cookieParser());

  // CORS - allow multiple origins for subdomain support
  const frontendUrl = configService.get(
    "FRONTEND_URL",
    "http://localhost:3000",
  );
  app.enableCors({
    origin: (origin: any, callback: any) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // Allow localhost and subdomains
      if (
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin === frontendUrl
      ) {
        return callback(null, true);
      }

      callback(null, false);
    },
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix("api");

  // Global filters and interceptors
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle("Communicate API")
    .setDescription("Multi-Tenant Twilio SaaS Platform API")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("auth", "Authentication endpoints")
    .addTag("users", "User management")
    .addTag("business", "Business/tenant management")
    .addTag("twilio", "Twilio integration")
    .addTag("booking", "Appointment booking")
    .addTag("inquiry", "Inquiry engine")
    .addTag("support", "Support/call center")
    .addTag("messaging", "SMS/WhatsApp messaging")
    .addTag("campaigns", "Marketing campaigns")
    .addTag("billing", "Subscription billing")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = configService.get("PORT", 3001);
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/docs`);
}

bootstrap();
