
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  domain?: string;

  constructor(name: string, domain?: string) {
    this.name = name;
    this.domain = domain;
  }
}
