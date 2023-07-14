import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { Bill } from '../../../domain/models/bill.entity';
import { BaseBillDto } from './base-bill.dto';
import { BaseLotDto } from '../lots/base-lot.dto';

export class BillDto extends BaseBillDto {
  @ApiProperty({
    type: BaseLotDto,
    description: 'Lote',
    required: true,
  })
  @IsString()
  @Expose()
  readonly lot: BaseLotDto;

  constructor(obj: Bill) {
    super(obj);
    this.lot = new BaseLotDto(obj.lot);
  }
}
