import { Controller, Get, Query } from '@nestjs/common';
import { BillsService } from '../../aplication/services/bills.service';
import { FilterBillDto } from '../dtos/bills/filter-bill.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BillDto } from '../dtos/bills/bill.dto';

@ApiTags('Bills')
@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get()
  @ApiResponse({
    description: 'Retorna uma lista de boletos.',
    type: [BillDto],
  })
  async list(@Query() filter: FilterBillDto): Promise<BillDto[]> {
    const bills = await this.billsService.find(filter);
    return bills.map((bill) => new BillDto(bill));
  }
}
