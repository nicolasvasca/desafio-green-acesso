import { Controller } from '@nestjs/common';
import { BillsService } from '../../aplication/services/bills.service';

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}
}
