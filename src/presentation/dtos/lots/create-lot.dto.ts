import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateLotDto {
  @ApiProperty({
    type: String,
    description: 'Lot Name',
    example: '16',
    required: true,
  })
  @IsString()
  @Expose()
  readonly name: string;
}
