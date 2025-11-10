import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';
import { Resource } from './resource.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resource_id: number;

  @ManyToOne(() => Resource)
  @JoinColumn({ name: 'resource_id' })
  resource: Resource;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  tenant_id: number;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column('datetime')
  start_time: Date;

  @Column('datetime')
  end_time: Date;

  @Column({ default: false })
  cancelled: boolean;
}

