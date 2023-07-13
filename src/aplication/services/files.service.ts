import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import * as stream from 'stream';
import * as csvParser from 'csv-parser';
import { BillsService } from './bills.service';
import { LotsService } from './lots.service';
import { FileBillDto } from '../../presentation/dtos/files/file-bill.dto';
import { transformStringToDto } from '../../utils/transformers/transformStringToDto';
import { BaseBillDto } from '../../presentation/dtos/bills/base-bill.dto';

@Injectable()
export class FilesService {
  constructor(
    @Inject(forwardRef(() => LotsService))
    private readonly lotsService: LotsService,
    @Inject(forwardRef(() => BillsService))
    private readonly billsService: BillsService,
  ) {}

  async processCsvFile(file: Express.Multer.File): Promise<BaseBillDto[]> {
    if (file.mimetype !== 'text/csv') {
      throw new BadRequestException(
        'O arquivo esperado deve ser de extensão .csv',
      );
    }
    const fileBillDtos: FileBillDto[] =
      await this.generateFileBillDtosByBillCsvFile(file);
    const baseBillDtos: BaseBillDto[] = await this.createLotsAndBills(
      fileBillDtos,
    );
    return baseBillDtos;
  }

  async generateFileBillDtosByBillCsvFile(
    file: Express.Multer.File,
  ): Promise<FileBillDto[]> {
    return new Promise<FileBillDto[]>((resolve, reject) => {
      const readStream = new stream.PassThrough();
      readStream.end(file.buffer);
      const fileBillDtos: FileBillDto[] = [];
      readStream
        .pipe(csvParser())
        .on('data', (data) => {
          const fileBillDto = transformStringToDto.toFileDto(
            Object.values(data)[0].toString(),
          );
          fileBillDtos.push(fileBillDto);
        })
        .on('end', () => {
          resolve(fileBillDtos);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async createLotsAndBills(fileBillDtos: FileBillDto[]): Promise<any> {
    return Promise.all(
      fileBillDtos.map(async (fileBillDto) => {
        let lot = await this.lotsService.findByName(fileBillDto.lotName);
        if (!lot) {
          lot = await this.lotsService.create({ name: fileBillDto.lotName });
        }
        const bill = await this.billsService.create({
          nameDrawn: fileBillDto.nameDrawn,
          digitableLine: fileBillDto.digitableLine,
          value: fileBillDto.value,
          lotId: lot.id,
        });
        return new BaseBillDto(bill);
      }),
    );
  }
}
