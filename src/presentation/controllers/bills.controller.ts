import {
  Controller,
  Get,
  Inject,
  Query,
  Res,
  forwardRef,
} from '@nestjs/common';
import { BillsService } from '../../aplication/services/bills.service';
import { FilterBillDto } from '../dtos/bills/filter-bill.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BillDto } from '../dtos/bills/bill.dto';
import { Response } from 'express';
import { FilesService } from '../../aplication/services/files.service';

@ApiTags('Bills')
@Controller('bills')
export class BillsController {
  constructor(
    private readonly billsService: BillsService,
    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService,
  ) {}

  @Get()
  @ApiResponse({
    description:
      'Retorna uma lista de boletos.' +
      'Ou em caso de relatory = 1, um pdf com todos os boletos' +
      'Ou em caso de relatory = 2 irá gerar um arquivo xlsx para excel',
    type: [BillDto],
  })
  async list(
    @Query() filter: FilterBillDto,
    @Res() res: Response,
  ): Promise<any> {
    if (filter?.relatory == 1) {
      const pdf = await this.filesService.createRelatory(
        Number(filter?.relatory),
      ); // Substitua "generateXLS" pela lógica de geração do seu XLS
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=relatorio.pdf',
      );
      res.send(pdf);
    } else if (filter?.relatory == 2) {
      const xls = await this.filesService.createRelatory(
        Number(filter?.relatory),
      );
      res.contentType(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.download(xls, 'relatorio.xlsx');
    } else {
      const bills = await this.billsService.find(filter);
      res.contentType('application/json');
      const billDtos = bills.map((bill) => new BillDto(bill));
      res.json(billDtos);
    }
  }
}
