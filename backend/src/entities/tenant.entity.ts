import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Resource } from './resource.entity';
import { Booking } from './booking.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Resource, (resource) => resource.tenant)
  resources: Resource[];

  @OneToMany(() => Booking, (booking) => booking.tenant)
  bookings: Booking[];
}

