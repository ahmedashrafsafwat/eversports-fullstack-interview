import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class Membership {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'uuid' })
  uuid: string;

  @Column()
  name: string;

  @Column()
  user: number;

  @Column('decimal', { precision: 10, scale: 2 })
  recurringPrice: number;

  @Column({ type: 'date' })
  validFrom: string;

  @Column({ type: 'date' })
  validUntil: string;

  @Column()
  state: 'active' | 'pending' | 'expired';

  @Column()
  assignedBy: string;

  @Column()
  paymentMethod: 'cash' | 'credit card' | 'debit' | 'bank_transfer';

  @Column()
  billingInterval: 'weekly' | 'monthly' | 'yearly';

  @Column()
  billingPeriods: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
