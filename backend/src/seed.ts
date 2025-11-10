import { DataSource } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { User, UserRole } from './entities/user.entity';
import { Resource } from './entities/resource.entity';
import { Booking } from './entities/booking.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const dataSource = new DataSource({
    type: (process.env.DB_TYPE as any) || 'sqlite',
    database: process.env.DB_DATABASE || 'booking-platform.db',
    entities: [Tenant, User, Resource, Booking],
    synchronize: true,
  });

  await dataSource.initialize();

  const tenantRepository = dataSource.getRepository(Tenant);
  const userRepository = dataSource.getRepository(User);

  // Create tenants
  const tenant1 = await tenantRepository.save({
    name: 'Acme Corporation',
  });

  const tenant2 = await tenantRepository.save({
    name: 'Tech Startup Inc',
  });

  // Create users for tenant 1
  const admin1Password = await bcrypt.hash('admin123', 10);
  const user1Password = await bcrypt.hash('user123', 10);

  await userRepository.save({
    email: 'admin@acme.com',
    password: admin1Password,
    tenant_id: tenant1.id,
    role: UserRole.TENANT_ADMIN,
  });

  await userRepository.save({
    email: 'user@acme.com',
    password: user1Password,
    tenant_id: tenant1.id,
    role: UserRole.TENANT_USER,
  });

  // Create users for tenant 2
  const admin2Password = await bcrypt.hash('admin123', 10);
  const user2Password = await bcrypt.hash('user123', 10);

  await userRepository.save({
    email: 'admin@techstartup.com',
    password: admin2Password,
    tenant_id: tenant2.id,
    role: UserRole.TENANT_ADMIN,
  });

  await userRepository.save({
    email: 'user@techstartup.com',
    password: user2Password,
    tenant_id: tenant2.id,
    role: UserRole.TENANT_USER,
  });

  console.log('Seed data created successfully!');
  console.log('\nTenant 1 (Acme Corporation):');
  console.log('  Admin: admin@acme.com / admin123');
  console.log('  User:  user@acme.com / user123');
  console.log('\nTenant 2 (Tech Startup Inc):');
  console.log('  Admin: admin@techstartup.com / admin123');
  console.log('  User:  user@techstartup.com / user123');

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});

