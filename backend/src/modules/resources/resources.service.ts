import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../../entities/resource.entity';
import { CreateResourceDto } from './dto/create-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}

  /**
   * Create a resource for a tenant
   * Only TENANT_ADMIN can create resources
   */
  async create(createResourceDto: CreateResourceDto, tenantId: number): Promise<Resource> {
    const resource = this.resourceRepository.create({
      name: createResourceDto.name,
      tenant_id: tenantId,
    });
    return this.resourceRepository.save(resource);
  }

  /**
   * List all resources for a tenant
   * All authenticated users can list resources in their tenant
   */
  async findAll(tenantId: number): Promise<Resource[]> {
    return this.resourceRepository.find({
      where: { tenant_id: tenantId },
      order: { id: 'ASC' },
    });
  }

  /**
   * Get a single resource by ID (tenant-scoped)
   */
  async findOne(id: number, tenantId: number): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    return resource;
  }
}

