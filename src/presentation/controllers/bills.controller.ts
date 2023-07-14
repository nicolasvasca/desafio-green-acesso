import { Controller, Get, Query } from '@nestjs/common';
import { BillsService } from '../../aplication/services/bills.service';
import { FilterBillDto } from '../dtos/bills/filter-bill.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bills')
@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get()
  // @ApiResponse({
  //   description: 'A list of users matching the corresponding filters.',
  //   type: ListUserDto,
  // })
  async list(@Query() filter: FilterBillDto): Promise<any> {
    const bills = await this.billsService.find(filter);
    return bills;
  }
}
