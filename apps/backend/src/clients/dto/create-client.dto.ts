import { IsString, IsObject, IsOptional } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsObject()
  @IsOptional()
  registrationNumbers?: object;

  @IsObject()
  @IsOptional()
  contactDetails?: object;

  @IsObject()
  @IsOptional()
  categories?: object;

  @IsObject()
  @IsOptional()
  customMetadata?: object;
}
