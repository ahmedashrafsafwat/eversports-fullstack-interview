import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Membership } from './membership';
  
  @Entity()
  export class MembershipPeriod {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'uuid' })
    uuid: string;
  
    @ManyToOne(() => Membership)
    @JoinColumn({ name: 'membership' })
    membership: Membership;
  
    @Column({ type: 'date' })
    start: string;
  
    @Column({ type: 'date' })
    end: string;
  
    @Column()
    state: 'issued' | 'planned' | 'expired';
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  