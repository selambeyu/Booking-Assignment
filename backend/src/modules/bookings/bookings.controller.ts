import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { TenantGuard } from '../../guards/tenant.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard, TenantGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    // User ID and Tenant ID come from JWT token
    return this.bookingsService.create(
      createBookingDto,
      req.user.userId,
      req.user.tenantId,
    );
  }

  @Get()
  findAll(@Request() req) {
    // User ID and Tenant ID come from JWT token
    return this.bookingsService.findAll(req.user.userId, req.user.tenantId);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Request() req) {
    // User ID and Tenant ID come from JWT token
    return this.bookingsService.cancel(
      parseInt(id),
      req.user.userId,
      req.user.tenantId,
    );
  }
}

