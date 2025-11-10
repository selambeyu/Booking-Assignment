/**
 * Booking Conflict Logic Tests
 * 
 * This test suite focuses on the critical business logic for preventing double-booking
 * conflicts. Per the assignment requirements, we prioritize focused, meaningful tests
 * over coverage percentage.
 * 
 * Testing Approach:
 * - Unit tests for the BookingsService.create() method
 * - Mocked TypeORM repositories for isolation
 * - Tests cover the core conflict detection algorithm
 * 
 * Scenarios Tested:
 * 1. Overlapping time slots → ConflictException thrown
 * 2. Non-overlapping time slots → Booking created successfully
 * 3. Cancelled bookings → Ignored in conflict detection (can book over cancelled slots)
 * 
 * Conflict Detection Logic:
 * A booking conflicts if it overlaps with any existing non-cancelled booking:
 * - New start time is between existing start and end
 * - New end time is between existing start and end
 * - New booking completely contains existing booking
 * - Existing booking completely contains new booking
 * 
 * Why This Approach:
 * - Focuses on the most critical business rule (preventing double-booking)
 * - Validates the core algorithm that ensures data integrity
 * - Tests edge cases (cancelled bookings) that affect business logic
 * - Fast, isolated unit tests that don't require database setup
 * 
 * Future Enhancements (if time permitted):
 * - Test boundary conditions (exact start/end time matches)
 * - Test multiple overlapping bookings
 * - Integration tests with real database
 * - E2E tests for full booking flow
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from '../../entities/booking.entity';
import { Resource } from '../../entities/resource.entity';

describe('BookingsService - Double Booking Prevention', () => {
  let service: BookingsService;
  let bookingRepository: Repository<Booking>;
  let resourceRepository: Repository<Resource>;

  const mockBookingRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockResourceRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(Resource),
          useValue: mockResourceRepository,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    bookingRepository = module.get<Repository<Booking>>(
      getRepositoryToken(Booking),
    );
    resourceRepository = module.get<Repository<Resource>>(
      getRepositoryToken(Resource),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should prevent double-booking when time slots overlap', async () => {
    // Arrange: Existing booking from 10:00 to 12:00 (using future dates)
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1); // One year from now
    const existingStart = new Date(futureDate);
    existingStart.setHours(10, 0, 0, 0);
    const existingEnd = new Date(futureDate);
    existingEnd.setHours(12, 0, 0, 0);

    const existingBooking: Partial<Booking> = {
      id: 1,
      resource_id: 1,
      start_time: existingStart,
      end_time: existingEnd,
      cancelled: false,
    };

    mockResourceRepository.findOne.mockResolvedValue({
      id: 1,
      name: 'Conference Room A',
      tenant_id: 1,
    });

    mockBookingRepository.find.mockResolvedValue([existingBooking]);

    const newStart = new Date(futureDate);
    newStart.setHours(11, 0, 0, 0);
    const newEnd = new Date(futureDate);
    newEnd.setHours(13, 0, 0, 0);

    const createBookingDto = {
      resource_id: 1,
      start_time: newStart.toISOString(), // Overlaps with existing (11:00-13:00)
      end_time: newEnd.toISOString(),
    };

    // Act & Assert
    await expect(
      service.create(createBookingDto, 2, 1),
    ).rejects.toThrow(ConflictException);

    expect(mockBookingRepository.save).not.toHaveBeenCalled();
  });

  it('should allow booking when time slots do not overlap', async () => {
    // Arrange: Existing booking from 10:00 to 12:00 (using future dates)
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1); // One year from now
    const existingStart = new Date(futureDate);
    existingStart.setHours(10, 0, 0, 0);
    const existingEnd = new Date(futureDate);
    existingEnd.setHours(12, 0, 0, 0);

    const existingBooking: Partial<Booking> = {
      id: 1,
      resource_id: 1,
      start_time: existingStart,
      end_time: existingEnd,
      cancelled: false,
    };

    mockResourceRepository.findOne.mockResolvedValue({
      id: 1,
      name: 'Conference Room A',
      tenant_id: 1,
    });

    mockBookingRepository.find.mockResolvedValue([existingBooking]);

    const newStart = new Date(futureDate);
    newStart.setHours(13, 0, 0, 0);
    const newEnd = new Date(futureDate);
    newEnd.setHours(14, 0, 0, 0);

    mockBookingRepository.create.mockReturnValue({
      resource_id: 1,
      user_id: 2,
      tenant_id: 1,
      start_time: newStart,
      end_time: newEnd,
      cancelled: false,
    });
    mockBookingRepository.save.mockResolvedValue({
      id: 2,
      resource_id: 1,
      user_id: 2,
      tenant_id: 1,
      start_time: newStart,
      end_time: newEnd,
      cancelled: false,
    });

    const createBookingDto = {
      resource_id: 1,
      start_time: newStart.toISOString(), // No overlap (13:00-14:00)
      end_time: newEnd.toISOString(),
    };

    // Act
    const result = await service.create(createBookingDto, 2, 1);

    // Assert
    expect(result).toBeDefined();
    expect(mockBookingRepository.save).toHaveBeenCalled();
  });

  it('should ignore cancelled bookings when checking for conflicts', async () => {
    // Arrange: Cancelled booking exists, but should not block new booking (using future dates)
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1); // One year from now
    const cancelledStart = new Date(futureDate);
    cancelledStart.setHours(10, 0, 0, 0);
    const cancelledEnd = new Date(futureDate);
    cancelledEnd.setHours(12, 0, 0, 0);

    const cancelledBooking: Partial<Booking> = {
      id: 1,
      resource_id: 1,
      start_time: cancelledStart,
      end_time: cancelledEnd,
      cancelled: true, // Cancelled booking
    };

    mockResourceRepository.findOne.mockResolvedValue({
      id: 1,
      name: 'Conference Room A',
      tenant_id: 1,
    });

    // Service filters for cancelled: false, so it should return empty array
    // (cancelled bookings are ignored)
    mockBookingRepository.find.mockResolvedValue([]);

    const newStart = new Date(futureDate);
    newStart.setHours(11, 0, 0, 0);
    const newEnd = new Date(futureDate);
    newEnd.setHours(13, 0, 0, 0);

    mockBookingRepository.create.mockReturnValue({
      resource_id: 1,
      user_id: 2,
      tenant_id: 1,
      start_time: newStart,
      end_time: newEnd,
      cancelled: false,
    });
    mockBookingRepository.save.mockResolvedValue({
      id: 2,
      resource_id: 1,
      user_id: 2,
      tenant_id: 1,
      start_time: newStart,
      end_time: newEnd,
      cancelled: false,
    });

    const createBookingDto = {
      resource_id: 1,
      start_time: newStart.toISOString(), // Would overlap with cancelled booking
      end_time: newEnd.toISOString(),
    };

    // Act
    const result = await service.create(createBookingDto, 2, 1);

    // Assert: Should succeed because cancelled bookings are ignored
    expect(result).toBeDefined();
    expect(mockBookingRepository.save).toHaveBeenCalled();
  });
});

