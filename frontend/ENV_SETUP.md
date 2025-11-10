# Environment Variables Setup

## Overview

The frontend uses environment variables for configuration. Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client-side code.

## Setup

### 1. Create `.env` file

Copy the example file and create your own `.env` file:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Edit the `.env` file with your configuration:

```env
# API Configuration
VITE_API_URL=http://localhost:3000
```

### 3. Environment-Specific Files

You can create environment-specific files:

- `.env` - Default environment variables
- `.env.local` - Local overrides (ignored by git)
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.[mode].local` - Mode-specific local overrides

Vite automatically loads the appropriate file based on the mode:
- `npm run dev` → `.env.development` (if exists) → `.env`
- `npm run build` → `.env.production` (if exists) → `.env`

## Available Variables

### `VITE_API_URL`

The base URL for the backend API.

- **Default**: `http://localhost:3000`
- **Example**: `http://localhost:3000` or `https://api.example.com`

## Usage in Code

Environment variables are accessed via `import.meta.env`:

```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

TypeScript types are defined in `src/vite-env.d.ts` for type safety.

## Important Notes

1. **VITE_ Prefix**: Only variables prefixed with `VITE_` are exposed to client-side code
2. **Restart Required**: Changes to `.env` files require restarting the dev server
3. **Git Ignore**: `.env` files are ignored by git (see `.gitignore`)
4. **Security**: Never commit `.env` files with sensitive data. Use `.env.example` as a template

## Example Configurations

### Development
```env
VITE_API_URL=http://localhost:3000
```

### Production
```env
VITE_API_URL=https://api.yourdomain.com
```

### Staging
```env
VITE_API_URL=https://staging-api.yourdomain.com
```

