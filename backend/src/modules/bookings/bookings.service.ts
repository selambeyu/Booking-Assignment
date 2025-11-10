import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../../entities/booking.entity';
import { Resource } from '../../entities/resource.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}

  /**
   * Create a booking for a resource in the user's tenant
   * Prevents double-booking by checking for overlapping time slots
   * 
   * Conflict Detection Algorithm:
   * 1. Fetch all non-cancelled bookings for the resource
   * 2. Check if new booking overlaps with any existing booking
   * 3. Overlap occurs if:
   *    - New start is between existing start and end, OR
   *    - New end is between existing start and end, OR
   *    - New booking completely contains existing booking, OR
   *    - Existing booking completely contains new booking
   * 4. Throw ConflictException if overlap detected
   * 
   * Note: Cancelled bookings are excluded from conflict checks (filtered by cancelled: false)
   * 
   * @see bookings.service.spec.ts for test coverage of this logic
   */
  async create(
    createBookingDto: CreateBookingDto,
    userId: number,
    tenantId: number,
  ): Promise<Booking> {
    // Verify resource exists and belongs to the tenant
    const resource = await this.resourceRepository.findOne({
      where: { id: createBookingDto.resource_id, tenant_id: tenantId },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found in your tenant');
    }

    // Validate time range
    const startTime = new Date(createBookingDto.start_time);
    const endTime = new Date(createBookingDto.end_time);

    if (startTime >= endTime) {
      throw new ForbiddenException('End time must be after start time');
    }

    if (startTime < new Date()) {
      throw new ForbiddenException('Cannot book in the past');
    }

    // Check for overlapping bookings (double-booking prevention)
    // Fetch all non-cancelled bookings for this resource
    const existingBookings = await this.bookingRepository.find({
      where: {
        resource_id: createBookingDto.resource_id,
        cancelled: false,
      },
    });

    // Check if new booking overlaps with any existing booking
    for (const existing of existingBookings) {
      const existingStart = new Date(existing.start_time);
      const existingEnd = new Date(existing.end_time);

      // Overlap occurs if:
      // - new start is between existing start and end, OR
      // - new end is between existing start and end, OR
      // - new booking completely contains existing booking, OR
      // - existing booking completely contains new booking
      if (
        (startTime >= existingStart && startTime < existingEnd) ||
        (endTime > existingStart && endTime <= existingEnd) ||
        (startTime <= existingStart && endTime >= existingEnd) ||
        (startTime > existingStart && endTime < existingEnd)
      ) {
        throw new ConflictException(
          'Resource is already booked for this time slot',
        );
      }
    }

    // Create the booking
    const booking = this.bookingRepository.create({
      resource_id: createBookingDto.resource_id,
      user_id: userId,
      tenant_id: tenantId,
      start_time: startTime,
      end_time: endTime,
      cancelled: false,
    });

    return this.bookingRepository.save(booking);
  }

  /**
   * List all bookings for the current user (tenant-scoped)
   */
  async findAll(userId: number, tenantId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: {
        user_id: userId,
        tenant_id: tenantId,
      },
      relations: ['resource'],
      order: { start_time: 'ASC' },
    });
  }

  /**
   * Cancel a booking (user can only cancel their own bookings)
   */
  async cancel(id: number, userId: number, tenantId: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: {
        id,
        user_id: userId,
        tenant_id: tenantId,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.cancelled) {
      throw new ForbiddenException('Booking is already cancelled');
    }

    booking.cancelled = true;
    return this.bookingRepository.save(booking);
  }
}

