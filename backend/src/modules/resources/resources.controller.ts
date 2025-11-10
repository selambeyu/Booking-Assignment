import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { TenantGuard } from '../../guards/tenant.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@Controller('resources')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.TENANT_ADMIN)
  create(@Body() createResourceDto: CreateResourceDto, @Request() req) {
    // Tenant ID comes from JWT token, not from request body
    return this.resourcesService.create(createResourceDto, req.user.tenantId);
  }

  @Get()
  findAll(@Request() req) {
    // Tenant ID comes from JWT token
    return this.resourcesService.findAll(req.user.tenantId);
  }
}

