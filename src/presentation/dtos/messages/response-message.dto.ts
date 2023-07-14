import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class ResponseMessageDto {
  @ApiProperty({
    type: String,
    description: 'Messagem de Sucesso',
    example: 'Arquivos gerados no Desktop',
    required: true,
  })
  @IsString()
  @Expose()
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}
