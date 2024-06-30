import { Booking } from 'src/bookings/entities/booking.entity';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Cabin extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  maxCapacity: number;

  @Column()
  regularPrice: number;

  @Column()
  discount: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  image?: string;

  @Column()
  createdAt: Date;

  @OneToMany(() => Booking, (booking) => booking.cabin)
  bookings: Booking[];
}
