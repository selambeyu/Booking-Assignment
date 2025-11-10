# Multi-Tenant Booking Platform

A full-stack SaaS booking platform built with NestJS (backend) and Vite + React + TypeScript (frontend). This application demonstrates multi-tenant architecture with tenant isolation, role-based access control, and booking management.

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for database management
- **SQLite** - Database (for development)
- **JWT** - Authentication
- **Passport** - Authentication middleware
- **bcrypt** - Password hashing
- **class-validator** - DTO validation

### Frontend
- **Vite** - Build tool and dev server
- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Project Structure

```
.
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── entities/    # TypeORM entities
│   │   ├── modules/      # Feature modules
│   │   │   ├── auth/     # Authentication
│   │   │   ├── tenants/  # Tenant management
│   │   │   ├── users/    # User management
│   │   │   ├── resources/# Resource CRUD
│   │   │   └── bookings/ # Booking management
│   │   ├── guards/       # Auth & tenant guards
│   │   ├── decorators/   # Custom decorators
│   │   └── seed.ts       # Database seeding
│   └── package.json
│
└── frontend/             # React frontend
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── contexts/      # React contexts
    │   ├── services/     # API client
    │   └── App.tsx       # Main app component
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Seed the database with initial data:
```bash
npm run seed
```

4. Start the development server:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Seed Credentials

The seed script creates two tenants with admin and user accounts:

### Tenant 1: Acme Corporation
- **Admin**: `admin@acme.com` / `admin123`
- **User**: `user@acme.com` / `user123`

### Tenant 2: Tech Startup Inc
- **Admin**: `admin@techstartup.com` / `admin123`
- **User**: `user@techstartup.com` / `user123`

## API Endpoints

### Authentication
- `POST /auth/login` - Login and receive JWT token

### Resources (Protected)
- `GET /resources` - List all resources for tenant
- `POST /resources` - Create resource (TENANT_ADMIN only)

### Bookings (Protected)
- `GET /bookings` - List user's bookings
- `POST /bookings` - Create a booking
- `PATCH /bookings/:id/cancel` - Cancel a booking

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Features

### Multi-Tenancy
- **Tenant Isolation**: Users can only access data from their own tenant
- **JWT-based**: Tenant ID is embedded in JWT token and enforced server-side
- **No Cross-Tenant Access**: All queries are automatically filtered by tenant ID

### Authentication & Authorization
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Two roles - TENANT_ADMIN and TENANT_USER
- **Protected Routes**: All resource/booking endpoints require authentication

### Resources Management
- **Tenant-Scoped**: Resources belong to a specific tenant
- **Admin-Only Creation**: Only TENANT_ADMIN can create resources
- **List Access**: All authenticated users can list their tenant's resources

### Booking Management
- **User-Scoped**: Users can only view their own bookings
- **Double-Booking Prevention**: System prevents overlapping bookings for the same resource
- **Cancellation**: Users can cancel their own bookings
- **Time Validation**: Prevents booking in the past and invalid time ranges

## Testing

### Minimal Testing Approach

Per the assignment requirements, we've implemented focused, meaningful tests for the critical booking conflict logic rather than aiming for high coverage percentage.

**Test Location**: `backend/src/modules/bookings/bookings.service.spec.ts`

**What's Tested**:
1. ✅ **Overlapping bookings** → ConflictException thrown (prevents double-booking)
2. ✅ **Non-overlapping bookings** → Booking created successfully
3. ✅ **Cancelled bookings** → Ignored in conflict detection (can book over cancelled slots)

**Testing Approach**:
- Unit tests with mocked TypeORM repositories for isolation
- Tests the core conflict detection algorithm
- Fast, focused tests that don't require database setup
- Clear documentation explaining the testing approach

Run backend tests:
```bash
cd backend
npm test
```

**Test Coverage**:
- Focuses on the most critical business rule: preventing double-booking
- Validates the core algorithm that ensures data integrity
- Tests edge cases (cancelled bookings) that affect business logic

## Development Notes

- **Database**: SQLite is used for development speed. For production, switch to PostgreSQL/MySQL
- **Synchronize**: TypeORM `synchronize: true` is enabled for development. Disable in production
- **CORS**: Configured to allow frontend origin (`http://localhost:5173`)
- **JWT Secret**: Uses a default secret for development. Change in production

## Multi-Tenancy Approach

The application uses **application-level multi-tenancy** with tenant ID stored in the JWT token:

1. **Tenant ID in JWT**: When a user logs in, their tenant ID is embedded in the JWT payload
2. **Automatic Filtering**: All database queries automatically filter by tenant ID from the JWT
3. **No Client Input**: Tenant ID is never accepted from client requests - it's always from the JWT
4. **Guard Enforcement**: `TenantGuard` ensures tenant ID is present in the JWT before allowing access

This approach ensures:
- **Security**: Users cannot access other tenants' data
- **Simplicity**: No need to pass tenant ID in every request
- **Performance**: Single database with efficient filtering

## License

MIT

