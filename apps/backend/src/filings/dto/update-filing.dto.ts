import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { FilingStage, SlaStatus } from '../filing.entity';

export class UpdateFilingDto {
  @IsNumber()
  @IsOptional()
  tenant_id?: number;

  @IsNumber()
  @IsOptional()
  client_id?: number;

  @IsNumber()
  @IsOptional()
  vehicle_id?: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsDateString()
  @IsOptional()
  due_date?: Date;

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
