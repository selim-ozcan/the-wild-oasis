import { AbstractEntity } from 'src/common/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Setting extends AbstractEntity {
  @Column()
  minBookingLength: number;

  @Column()
  maxBookingLength: number;

  @Column()
  maxGuestsPerBooking: number;

  @Column()
  breakfastPrice: number;

  @Column()
  createdAt: Date;
}
