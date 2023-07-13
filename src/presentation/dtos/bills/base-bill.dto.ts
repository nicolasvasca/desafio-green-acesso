import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToClass } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { Bill } from '../../../domain/models/bill.entity';

export class BaseBillDto {
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
    description: 'Nome Sacado',
    example: 'JOSE DA SILVA',
    required: true,
  })
  @IsString()
  @Expose()
  readonly nameDrawn: string;

  @ApiProperty({
    type: String,
    description: 'Linha digitavel',
    example: '123456123456123456',
    required: true,
  })
  @IsString()
  @Expose()
  readonly digitableLine: string;

  @ApiProperty({
    type: Number,
    description: 'Valor do boleto',
    example: 188,
    required: true,
  })
  @IsNumber()
  @Expose()
  readonly value: number;

  @ApiProperty({
    type: Date,
    description: 'Dada de criação no banco de dados',
    example: '2023-07-13T21:11:03.529Z',
    required: true,
  })
  @IsNumber()
  @Expose()
  readonly createdAt: Date;

  constructor(obj: Bill) {
    Object.assign(
      this,
      plainToClass(Bill, obj, { excludeExtraneousValues: true }),
    );
  }
}
