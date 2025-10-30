
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../clients/client.entity';

@Entity({
  name: 'vehicles',
})
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'text',
    name: 'vehicle_type',
  })
  vehicleType: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  category: string;

  @Column({
    nullable: false,
    type: 'text',
    name: 'regulatory_regime',
  })
  regulatoryRegime: string;

  @Column({
    nullable: false,
    type: 'text',
    name: 'compliance_calendar_template',
  })
  complianceCalendarTemplate: string;

  @ManyToOne(() => Client, (client) => client.id)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
