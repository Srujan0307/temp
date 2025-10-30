
import { IsOptional, IsString } from 'class-validator';

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  readonly vehicleType?: string;

  @IsString()
  @IsOptional()
  readonly category?: string;

  @IsString()
  @IsOptional()
  readonly regulatoryRegime?: string;

  @IsString()
  @IsOptional()
  readonly complianceCalendarTemplate?: string;
}
