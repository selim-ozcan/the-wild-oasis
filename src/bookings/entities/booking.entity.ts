import { Cabin } from 'src/cabins/entities/cabin.entity';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { Guest } from 'src/guests/entities/guest.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Booking extends AbstractEntity {
  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column()
  numGuests: number;

  @Column()
  hasBreakfast: boolean;

  @Column()
  isPaid: boolean;

  @Column()
  observations: string;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  numNights: number;

  @Column({ nullable: true })
  cabinPrice: number;

  @Column({ nullable: true })
  extrasPrice: number;

  @Column({ nullable: true })
  totalPrice: number;

  @Column()
  guestId: number;

  @Column()
  cabinId: number;

  @ManyToOne(() => Guest, (guest) => guest.bookings)
  guest: Guest;

  @ManyToOne(() => Cabin, (cabin) => cabin.bookings)
  cabin: Cabin;
}
