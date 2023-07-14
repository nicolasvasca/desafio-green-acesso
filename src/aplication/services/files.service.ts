import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import * as stream from 'stream';
import * as csvParser from 'csv-parser';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as pdf from 'pdf-extraction';
import { PDFDocument } from 'pdf-lib';
import { BillsService } from './bills.service';
import { LotsService } from './lots.service';
import { FileBillDto } from '../../presentation/dtos/files/file-bill.dto';
import { transformStringToDto } from '../../utils/transformers/transformStringToDto';
import { BaseBillDto } from '../../presentation/dtos/bills/base-bill.dto';
import { ResponseMessageDto } from '../../presentation/dtos/messages/response-message.dto';
import { PDFOrdersService } from './pdf-orders.service';
import { PDFOrder } from '../../domain/models/pdf-order.entity';
import { transforNamesToObjectName } from 'src/utils/transformers/transformNamesToObjectName';

@Injectable()
export class FilesService {
  constructor(
    @Inject(forwardRef(() => LotsService))
    private readonly lotsService: LotsService,
    @Inject(forwardRef(() => BillsService))
    private readonly billsService: BillsService,
    @Inject(forwardRef(() => PDFOrdersService))
    private readonly pdfOrdersService: PDFOrdersService,
  ) {}

  async processCsvFile(file: Express.Multer.File): Promise<BaseBillDto[]> {
    if (file?.mimetype !== 'text/csv') {
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

  async createPDFs(file: Express.Multer.File): Promise<ResponseMessageDto> {
    if (file?.mimetype !== 'application/pdf') {
      throw new BadRequestException(
        'O arquivo esperado deve ser de extensão .csv',
      );
    }
    let pdfOrders = await this.pdfOrdersService.find();
    if (pdfOrders.length === 0) {
      pdfOrders = await this.generatePDFOrders(file);
    }
    const billsIds = await this.getBillsIds(pdfOrders);
    await this.splitPDFPages(file, billsIds);
    await this.billsService.updateBillsHasPdf(billsIds);
    return new ResponseMessageDto('Arquivo criado no Desktop');
  }

  async splitPDFPages(file: Express.Multer.File, billsIds: string[]) {
    const pdfBytes = file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const date = new Date().getTime();

    const desktopDir = path.join(os.homedir(), 'Desktop');
    const outputDir = path.join(desktopDir, 'Boletos' + date);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const newPDFDoc = await PDFDocument.create();
      const [copiedPage] = await newPDFDoc.copyPages(pdfDoc, [i]);
      newPDFDoc.addPage(copiedPage);
      const outputPath = path.join(outputDir, `boleto_${billsIds[i]}.pdf`);
      const newPDFBytes = await newPDFDoc.save();
      fs.writeFileSync(outputPath, newPDFBytes);
    }
  }

  async generatePDFOrders(file: Express.Multer.File): Promise<PDFOrder[]> {
    const dataBuffer = file.buffer;
    const names = await pdf(dataBuffer)
      .then((data) => {
        return data.text.split('\n');
      })
      .catch(() => {
        throw new InternalServerErrorException('Erro ao ler PDF');
      });

    const bills = await this.billsService.find();

    if (bills.length === 0) {
      throw new NotFoundException('Nenhum Boleto encontrado');
    }
    const billsNameDrawns = bills.map((bill) => bill.nameDrawn);
    const objectNames =
      transforNamesToObjectName.nameCorrections(billsNameDrawns);
    const pdfOrders = [];
    for (const name of names) {
      if (name) {
        const pdfOrder = await this.pdfOrdersService.create(objectNames[name]);
        pdfOrders.push(pdfOrder);
      }
    }
    return pdfOrders;
  }

  async getBillsIds(pdfOrders: PDFOrder[]): Promise<string[]> {
    return Promise.all(
      pdfOrders.map(async (pdfOrder) => {
        const bill = await this.billsService.findOne(pdfOrder.name, false);
        return bill.id;
      }),
    );
  }
}
