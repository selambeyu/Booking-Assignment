# Lib Directory

This directory contains shared library code including types, hooks, and utilities.

## Structure

```
lib/
├── types/        # TypeScript type definitions
├── hooks/        # Custom React hooks
├── utils/        # Utility functions
└── index.ts      # Centralized exports
```

## Usage

### Import from lib directly

```typescript
// Import types
import { User, Resource, Booking } from '../lib/types';

// Import hooks
import { useResources, useBookings, useCreateResource } from '../lib/hooks';

// Import utils
import { cn } from '../lib/utils/cn';
import { formatDateTime } from '../lib/utils/date';
```

### Import from lib index (recommended)

```typescript
// Import everything from lib
import { User, Resource, useResources, useCreateResource, cn, formatDateTime } from '../lib';
```

## Contents

### Types (`lib/types/`)
- **User**: User interface with role and tenant information
- **Resource**: Resource interface
- **Booking**: Booking interface with resource relationship
- **LoginResponse**: Authentication response interface
- **ApiError**: API error interface

### Hooks (`lib/hooks/`)
- **useResources**: React Query hook to fetch all resources
- **useBookings**: React Query hook to fetch all bookings
- **useCreateResource**: React Query mutation hook to create a resource
- **useCreateBooking**: React Query mutation hook to create a booking
- **useCancelBooking**: React Query mutation hook to cancel a booking

### Utils (`lib/utils/`)
- **cn**: Utility function to merge Tailwind CSS classes
- **date**: Date formatting and conversion utilities
  - `formatDateTime`: Format date string to readable format
  - `toISOString`: Convert datetime-local to ISO string
  - `getCurrentDateTimeLocal`: Get current date-time in datetime-local format

## Benefits

✅ **Centralized location**: All shared code in one place
✅ **Easy imports**: Can import from lib index or specific subdirectories
✅ **Better organization**: Clear separation of concerns
✅ **Reusability**: Shared code can be used across the application
✅ **Maintainability**: Changes to shared code are centralized

