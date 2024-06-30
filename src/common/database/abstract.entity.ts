import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AbstractEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
