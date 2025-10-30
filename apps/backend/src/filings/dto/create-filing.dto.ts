import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { FilingStage, SlaStatus } from '../filing.entity';

export class CreateFilingDto {
  @IsNumber()
  tenant_id: number;

  @IsNumber()
  client_id: number;

  @IsNumber()
  vehicle_id: number;

  @IsString()
  type: string;

  @IsDateString()
  due_date: Date;

  @IsEnum(FilingStage)
  @IsOptional()
  stage?: FilingStage;

  @IsEnum(SlaStatus)
  @IsOptional()
  sla_status?: SlaStatus;

  @IsNumber()
  @IsOptional()
  assigned_to?: number;
}
