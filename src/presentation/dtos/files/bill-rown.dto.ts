import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class BillRownDto {
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
  readonly nome_sacado: string;

  @ApiProperty({
    type: String,
    description: 'Id do Lote',
    example: 'JOSE DA SILVA',
    required: true,
  })
  @IsString()
  @Expose()
  readonly id_lote: string;

  @ApiProperty({
    type: Number,
    description: 'Valor do boleto',
    example: 188,
    required: true,
  })
  @IsNumber()
  @Expose()
  readonly valor: number;

  @ApiProperty({
    type: String,
    description: 'Linha digitavel',
    example: '123456123456123456',
    required: true,
  })
  @IsString()
  @Expose()
  readonly linha_digitavel: string;

  constructor(
    id: string,
    nameDrawn: string,
    lotId: string,
    value: number,
    digitableLine: string,
  ) {
    this.id = id;
    this.nome_sacado = nameDrawn;
    this.id_lote = lotId;
    this.valor = value;
    this.linha_digitavel = digitableLine;
  }
}
