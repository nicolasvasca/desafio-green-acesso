import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class FileBillDto {
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
    type: String,
    description: 'Nome do Lote',
    example: '17',
    required: true,
  })
  @IsString()
  @Expose()
  readonly lotName: string;

  constructor(
    nameDrawn: string,
    lotName: string,
    value: number,
    digitableLine: string,
  ) {
    this.nameDrawn = nameDrawn;
    this.digitableLine = digitableLine;
    this.value = value;
    this.lotName = lotName;
  }
}
