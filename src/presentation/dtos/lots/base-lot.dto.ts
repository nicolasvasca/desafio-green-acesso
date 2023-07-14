import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToClass } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { Lot } from '../../../domain/models/lot.entity';

export class BaseLotDto {
  @ApiProperty({
    type: String,
    description: 'Id do Boleto',
    example: '2',
    required: true,
  })
  @IsString()
  @Expose()
  readonly id: string;

  @ApiProperty({
    type: String,
    description: 'Nome do Lote',
    example: '18',
    required: true,
  })
  @IsString()
  @Expose()
  readonly name: string;

  @ApiProperty({
    type: Date,
    description: 'Dada de criação no banco de dados',
    example: '2023-07-13T21:11:03.529Z',
    required: true,
  })
  @IsNumber()
  @Expose()
  readonly createdAt: Date;

  @ApiProperty({
    type: Boolean,
    description: 'Ativo',
    example: true,
    required: true,
  })
  @IsString()
  @Expose()
  readonly active: boolean;

  constructor(obj: Lot) {
    Object.assign(
      this,
      plainToClass(Lot, obj, { excludeExtraneousValues: true }),
    );
  }
}
