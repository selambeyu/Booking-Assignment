# Services Directory

This directory contains the API client and API service functions.

## File Structure

### `client.ts`
Contains the axios client configuration:
- **ApiClient class**: Singleton class that manages the axios instance
- **Interceptors**: Request/response interceptors for authentication and error handling
- **Token management**: Methods to set/clear authentication tokens
- **Exports**: 
  - `apiClient`: The singleton instance
  - `api`: The configured axios instance

### `api.ts`
Contains API service functions organized by domain:
- **authApi**: Authentication endpoints (login)
- **resourcesApi**: Resource management endpoints (getAll, create)
- **bookingsApi**: Booking management endpoints (getAll, create, cancel)

## Usage

### Using the API client directly
```typescript
import { api } from '../services/client';

// Make a custom request
const response = await api.get('/custom-endpoint');
```

### Using API service functions (Recommended)
```typescript
import { resourcesApi } from '../services/api';

// Use the service functions
const resources = await resourcesApi.getAll();
```

### Managing authentication tokens
```typescript
import { apiClient } from '../services/client';

// Set token after login
apiClient.setAuthToken(token);

// Clear token on logout
apiClient.clearAuthToken();
```

## Benefits of Separation

✅ **Separation of concerns**: Client configuration separate from API functions
✅ **Better organization**: Clear distinction between infrastructure and business logic
✅ **Easier testing**: Can mock the client separately from API functions
✅ **Reusability**: Client can be used for custom requests outside of API functions
✅ **Maintainability**: Changes to client configuration don't affect API function definitions

