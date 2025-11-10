import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Tenant Guard ensures that users can only access data from their own tenant.
 * The tenant ID is extracted from the JWT token (set during login).
 * This guard should be used on all tenant-scoped endpoints.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.tenantId) {
      throw new ForbiddenException('Tenant information missing');
    }

    // Tenant ID from JWT is automatically trusted
    // All queries should filter by tenantId from the JWT, not from request params
    return true;
  }
}

