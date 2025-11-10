# Design Notes - Multi-Tenant Booking Platform

## Overview

This document outlines the design decisions, architecture, and trade-offs made in building the multi-tenant booking platform within the 3-hour time constraint.

## Data Model

### Entities

1. **Tenant**
   - `id`: Primary key
   - `name`: Tenant organization name
   - Relationships: One-to-many with Users, Resources, Bookings

2. **User**
   - `id`: Primary key
   - `email`: Unique identifier
   - `password`: Hashed using bcrypt
   - `tenant_id`: Foreign key to Tenant
   - `role`: Enum (TENANT_ADMIN, TENANT_USER)
   - Relationships: Many-to-one with Tenant, One-to-many with Bookings

3. **Resource**
   - `id`: Primary key
   - `name`: Resource name (e.g., "Conference Room A")
   - `tenant_id`: Foreign key to Tenant
   - Relationships: Many-to-one with Tenant, One-to-many with Bookings

4. **Booking**
   - `id`: Primary key
   - `resource_id`: Foreign key to Resource
   - `user_id`: Foreign key to User
   - `tenant_id`: Foreign key to Tenant (denormalized for query efficiency)
   - `start_time`: UTC datetime
   - `end_time`: UTC datetime
   - `cancelled`: Boolean flag
   - Relationships: Many-to-one with Resource, User, Tenant

### Design Decisions

- **Denormalized tenant_id in Booking**: Added `tenant_id` directly to Booking table for efficient tenant-scoped queries without joins
- **Cancelled flag vs Deletion**: Used soft delete (cancelled flag) to preserve booking history
- **UTC Time Storage**: All times stored in UTC to avoid timezone issues

## Multi-Tenancy Architecture

### Approach: Application-Level Multi-Tenancy with JWT

**Implementation:**
- Tenant ID is embedded in JWT token payload during login
- All protected endpoints use `TenantGuard` to extract tenant ID from JWT
- Database queries automatically filter by tenant ID from JWT (never from client input)

**Why This Approach:**
1. **Security**: Tenant ID cannot be spoofed - it's cryptographically signed in JWT
2. **Simplicity**: No need to pass tenant ID in every request body/query param
3. **Performance**: Single database with efficient WHERE clause filtering
4. **Scalability**: Can easily partition by tenant later if needed

**Tenant Isolation Flow:**
```
1. User logs in → JWT contains { sub, tenantId, role, email }
2. Request to protected endpoint → JWT validated → TenantGuard extracts tenantId
3. Service layer queries → Automatically filters by tenantId from JWT
4. Response → Only tenant's data returned
```

### Guard Architecture

- **JwtAuthGuard**: Validates JWT token and extracts user info
- **TenantGuard**: Ensures tenant ID is present in JWT (additional safety check)
- **RolesGuard**: Enforces role-based access (TENANT_ADMIN vs TENANT_USER)

## Double-Booking Prevention

### Algorithm

The system prevents double-booking by checking for overlapping time slots:

1. **Time Range Validation**:
   - End time must be after start time
   - Start time cannot be in the past

2. **Overlap Detection**:
   - Query existing non-cancelled bookings for the resource
   - Check if new booking overlaps with any existing booking
   - Overlap occurs if:
     - New start is between existing start and end, OR
     - New end is between existing start and end, OR
     - New booking completely contains existing booking

3. **Cancelled Bookings**: Ignored in conflict detection

### Implementation

```typescript
// Simplified logic
for (const existing of existingBookings) {
  if (
    (startTime >= existingStart && startTime < existingEnd) ||
    (endTime > existingStart && endTime <= existingEnd) ||
    (startTime <= existingStart && endTime >= existingEnd)
  ) {
    throw new ConflictException('Resource already booked');
  }
}
```

### Trade-offs

- **Current**: In-memory overlap checking after fetching all bookings
- **Production Improvement**: Database-level constraint or stored procedure for atomic checking
- **Race Condition**: Current implementation has a small window for race conditions. Production would need database-level locking

## Authentication & Authorization

### JWT Strategy

- **Payload**: `{ sub: userId, tenantId, role, email }`
- **Expiration**: 24 hours (configurable)
- **Storage**: Frontend stores in localStorage
- **Validation**: Passport JWT strategy validates on each request

### Role-Based Access Control

- **TENANT_ADMIN**:
  - Can create/list resources within their tenant
  - Can create/list/cancel bookings (their own)
  
- **TENANT_USER**:
  - Can list resources within their tenant
  - Can create/list/cancel bookings (their own)

### Authorization Rules

- Resources: Admin-only creation, all users can list
- Bookings: All authenticated users can create, users can only view their own
- Tenant isolation: Enforced at service layer, not just controller

## API Design

### RESTful Conventions

- `POST /auth/login` - Authentication
- `GET /resources` - List resources
- `POST /resources` - Create resource
- `GET /bookings` - List user's bookings
- `POST /bookings` - Create booking
- `PATCH /bookings/:id/cancel` - Cancel booking

### Error Handling

- **401 Unauthorized**: Invalid/missing JWT
- **403 Forbidden**: Insufficient permissions or tenant mismatch
- **404 Not Found**: Resource/booking not found
- **409 Conflict**: Double-booking attempt
- **400 Bad Request**: Validation errors

### DTOs

All endpoints use DTOs with class-validator for:
- Input validation
- Type safety
- Automatic error messages

## Frontend Architecture

### State Management

- **React Context**: Used for authentication state (user, token)
- **Local State**: Component-level state for forms and UI
- **No Global State Library**: Simple enough that Redux/Zustand not needed

### API Client

- **Axios Instance**: Configured with base URL and auth headers
- **Automatic Token Injection**: Token added to all requests from localStorage
- **Error Handling**: Centralized error handling in components

### Routing

- **React Router**: Client-side routing
- **Protected Routes**: Wrapped with authentication check
- **Navigation**: Programmatic navigation after login/logout

### Component Structure

```
App
├── AuthProvider (Context)
└── Router
    ├── Login (Public)
    └── Layout (Protected)
        ├── Resources
        └── Bookings
```

## Testing Strategy

### Minimal Testing Approach (Per Assignment Requirements)

Following the assignment requirement: *"We value a focused, meaningful test over coverage percentage"*, we've implemented focused tests for the critical booking conflict logic.

**Test File**: `backend/src/modules/bookings/bookings.service.spec.ts`

### Unit Tests

- **Booking Service**: Tests for double-booking prevention logic
- **Coverage**: Focused on critical business logic (booking conflicts)
- **Mocking**: TypeORM repositories mocked for isolation
- **Approach**: Unit tests that don't require database setup

### Test Cases Covered

1. ✅ **Overlapping bookings** → ConflictException thrown (prevents double-booking)
2. ✅ **Non-overlapping bookings** → Booking created successfully
3. ✅ **Cancelled bookings** → Ignored in conflict detection (can book over cancelled slots)

### Conflict Detection Algorithm Tested

The tests validate the core algorithm that checks for overlapping time slots:
- New start time is between existing start and end
- New end time is between existing start and end
- New booking completely contains existing booking
- Existing booking completely contains new booking

### Why This Approach

- ✅ Focuses on the most critical business rule (preventing double-booking)
- ✅ Validates the core algorithm that ensures data integrity
- ✅ Tests edge cases (cancelled bookings) that affect business logic
- ✅ Fast, isolated unit tests that don't require database setup
- ✅ Clear documentation explaining the testing approach

### Trade-offs

- **Limited Coverage**: Due to 3-hour constraint, focused on critical path
- **E2E Tests**: Not included (would add significant time)
- **Integration Tests**: Not included (would require test database setup)
- **Future Enhancements**: Boundary conditions, multiple overlapping bookings, integration tests

## Trade-offs & Limitations (3-Hour Constraint)

### What Was Prioritized

1. ✅ Core multi-tenancy with proper isolation
2. ✅ JWT authentication and authorization
3. ✅ Double-booking prevention logic
4. ✅ Clean NestJS module structure
5. ✅ Functional frontend with all required pages
6. ✅ Basic error handling

### What Was Simplified

1. ⚠️ **Database Migrations**: Using `synchronize: true` instead of migrations
2. ⚠️ **Pagination**: Not implemented (would be needed for production)
3. ⚠️ **Input Sanitization**: Basic validation only
4. ⚠️ **Rate Limiting**: Not implemented
5. ⚠️ **Logging**: Minimal logging
6. ⚠️ **Error Messages**: Basic error messages (not user-friendly)
7. ⚠️ **UI Polish**: Functional but minimal styling
8. ⚠️ **Test Coverage**: Only critical path tested



## Security Considerations

### Implemented

- ✅ Password hashing with bcrypt
- ✅ JWT token expiration
- ✅ Tenant ID from JWT (not client input)
- ✅ Role-based access control
- ✅ Input validation with DTOs
- ✅ CORS configuration



## Conclusion

The application demonstrates a solid foundation for a multi-tenant booking platform with:
- Proper tenant isolation
- Secure authentication
- Double-booking prevention
- Clean architecture
- Functional frontend



