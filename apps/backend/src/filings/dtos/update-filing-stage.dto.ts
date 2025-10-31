import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FilingStage } from '../filing.entity';

export class UpdateFilingStageDto {
  @IsEnum(FilingStage)
  stage: FilingStage;

  @IsString()
  @IsOptional()
  assigneeId?: string;
}
