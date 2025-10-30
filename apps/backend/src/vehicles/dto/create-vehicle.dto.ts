
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  readonly vehicleType: string;

  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  @IsNotEmpty()
  readonly regulatoryRegime: string;

  @IsString()
  @IsNotEmpty()
  readonly complianceCalendarTemplate: string;
}
