import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { Tenant } from './entities/tenant.entity';
import { User } from './entities/user.entity';
import { Resource } from './entities/resource.entity';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || 'sqlite',
      database: process.env.DB_DATABASE || 'booking-platform.db',
      entities: [Tenant, User, Resource, Booking],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-sync only in development
      logging: process.env.DB_LOGGING === 'true',
    }),
    AuthModule,
    TenantsModule,
    UsersModule,
    ResourcesModule,
    BookingsModule,
  ],
})
export class AppModule {}

