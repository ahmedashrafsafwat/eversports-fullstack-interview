import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  BeforeInsert,
  OneToMany
} from 'typeorm';
import Model from './model';
import bcrypt from 'bcryptjs';

export enum RoleEnumType {
  USER = 'user',
  ADMIN = 'admin'
}

@Entity('User')
export class User extends Model {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('email_index')
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  toJSON() {
    return { ...this, password: undefined, verified: undefined };
  }
  // ? Hash password before saving to database
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // ? Validate password
  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}
