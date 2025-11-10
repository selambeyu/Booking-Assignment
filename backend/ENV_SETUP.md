# Environment Variables Setup

## Overview

The backend uses environment variables for configuration. NestJS uses `@nestjs/config` to load environment variables from `.env` files.

## Setup

### 1. Create `.env` file

Copy the example file and create your own `.env` file:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production

# Database Configuration
DB_TYPE=sqlite
DB_DATABASE=booking-platform.db
```

### 3. Environment-Specific Files

You can create environment-specific files:

- `.env` - Default environment variables
- `.env.local` - Local overrides (ignored by git)
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.[mode].local` - Mode-specific local overrides

NestJS automatically loads `.env` files. For environment-specific files, you may need to configure `ConfigModule` accordingly.

## Available Variables

### Server Configuration

#### `PORT`
The port on which the backend server will run.

- **Default**: `3000`
- **Example**: `3000` or `8080`

#### `CORS_ORIGIN`
The origin URL allowed for CORS requests (frontend URL).

- **Default**: `http://localhost:5173`
- **Example**: `http://localhost:5173` or `https://yourdomain.com`

### JWT Configuration

#### `JWT_SECRET`
Secret key used for signing and verifying JWT tokens.

- **Default**: `your-secret-key-change-in-production`
- **Important**: **MUST** be changed in production!
- **Example**: Generate a secure random string (e.g., `openssl rand -base64 32`)

### Database Configuration

#### `DB_TYPE`
Database type (currently supports `sqlite`).

- **Default**: `sqlite`
- **Example**: `sqlite`

#### `DB_DATABASE`
Database file name (for SQLite) or database name (for other databases).

- **Default**: `booking-platform.db`
- **Example**: `booking-platform.db` or `booking_platform_prod`

#### `DB_LOGGING`
Enable database query logging.

- **Default**: `false` (not set)
- **Example**: `true` or `false`

## Usage in Code

Environment variables are accessed via `process.env`:

```typescript
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || 'default-secret';
```

NestJS `ConfigModule` is configured globally in `app.module.ts`, so you can also use `ConfigService`:

```typescript
import { ConfigService } from '@nestjs/config';

constructor(private configService: ConfigService) {
  const port = this.configService.get<number>('PORT', 3000);
  const jwtSecret = this.configService.get<string>('JWT_SECRET');
}
```

## Important Notes

1. **Security**: Never commit `.env` files with sensitive data (especially `JWT_SECRET`)
2. **Production**: Always use strong, unique secrets in production
3. **Restart Required**: Changes to `.env` files require restarting the server
4. **Git Ignore**: `.env` files are ignored by git (see `.gitignore`)

## Example Configurations

### Development
```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=dev-secret-key-change-in-production
DB_TYPE=sqlite
DB_DATABASE=booking-platform.db
DB_LOGGING=false
```

### Production
```env
PORT=8080
CORS_ORIGIN=https://yourdomain.com
JWT_SECRET=<strong-random-secret-generated-with-openssl>
DB_TYPE=sqlite
DB_DATABASE=booking-platform-prod.db
DB_LOGGING=false
NODE_ENV=production
```

### Staging
```env
PORT=3000
CORS_ORIGIN=https://staging.yourdomain.com
JWT_SECRET=<staging-secret-key>
DB_TYPE=sqlite
DB_DATABASE=booking-platform-staging.db
DB_LOGGING=true
```

## Generating Secure JWT Secret

For production, generate a secure random secret:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Database Synchronization

The `synchronize` option in TypeORM is automatically set based on `NODE_ENV`:
- **Development** (`NODE_ENV !== 'production'`): `synchronize: true` (auto-sync schema)
- **Production** (`NODE_ENV === 'production'`): `synchronize: false` (manual migrations)

**Important**: Never use `synchronize: true` in production! Use migrations instead.

