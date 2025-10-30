import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Tenant } from '../../tenancy/tenant.entity';
import { Document } from '../../storage/document.entity';

@Entity({ name: 'clients' })
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  registrationNumbers: object;

  @Column({ type: 'jsonb', nullable: true })
  contactDetails: object;

  @Column({ type: 'jsonb', nullable: true })
  categories: object;

  @Column({ type: 'jsonb', nullable: true })
  customMetadata: object;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @OneToOne(() => Document)
  @JoinColumn({ name: 'logoId' })
  logo: Document;

  @Column({ nullable: true })
  logoId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
