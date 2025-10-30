
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vehicle } from '../vehicles/vehicle.entity';

@Entity({
  name: 'calendar_events',
})
export class CalendarEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  title: string;

  @Column({
    nullable: false,
    type: 'date',
    name: 'due_date',
  })
  dueDate: Date;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.id)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
