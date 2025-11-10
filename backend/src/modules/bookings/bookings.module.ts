import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from '../../entities/booking.entity';
import { Resource } from '../../entities/resource.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Resource])],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}

