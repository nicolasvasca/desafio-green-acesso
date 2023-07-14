import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FilterBillDto {
  @ApiProperty({
    type: String,
    description: 'Nome no boleto',
    example: 'Jose',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  readonly name?: string;

  @ApiProperty({
    type: Number,
    description: 'Valor do mínimo do Boleto',
    example: 188,
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  @Expose()
  readonly valueMin?: number;

  @ApiProperty({
    type: Number,
    description: 'Valor do máximo do Boleto',
    example: 188,
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  @Expose()
  readonly valueMax?: number;

  @ApiProperty({
    type: String,
    description: 'Id do Lote',
    example: '1',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  readonly lotId?: string;
}
