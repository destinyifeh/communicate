-- Initialize database extensions
-- Prisma handles all schema creation, this just ensures extensions are ready
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE communicate TO communicate;
