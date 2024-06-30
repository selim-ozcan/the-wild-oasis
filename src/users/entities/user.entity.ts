import { Role } from 'src/auth/enums/role.enum';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends AbstractEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ enum: Role, default: Role.Admin })
  role: Role;
}
