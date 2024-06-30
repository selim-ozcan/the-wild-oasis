import { Booking } from 'src/bookings/entities/booking.entity';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Guest extends AbstractEntity {
  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  nationality: string;

  @Column()
  countryFlag: string;

  @Column()
  nationalId: string;

  @Column()
  createdAt: Date;

  @OneToMany(() => Booking, (booking) => booking.guest)
  bookings: Booking[];
}
