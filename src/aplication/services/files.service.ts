/* eslint-disable @typescript-eslint/no-unused-vars */
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
import * as tmp from 'tmp';
import * as pdfkit from 'pdfkit';
import { PDFDocument } from 'pdf-lib';
import { BillsService } from './bills.service';
import { LotsService } from './lots.service';
import { FileBillDto } from '../../presentation/dtos/files/file-bill.dto';
import { transformStringToDto } from '../../utils/transformers/transformStringToDto';
import { BaseBillDto } from '../../presentation/dtos/bills/base-bill.dto';
import { ResponseMessageDto } from '../../presentation/dtos/messages/response-message.dto';
import { PDFOrdersService } from './pdf-orders.service';
import { PDFOrder } from '../../domain/models/pdf-order.entity';
import { transforNamesToObjectName } from '../../utils/transformers/transformNamesToObjectName';
import { styleSheets } from '../../utils/helpers/style-sheets';
import { Workbook } from 'exceljs';
import { BillRownDto } from '../../presentation/dtos/files/bill-rown.dto';

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

  async createXLSXRelatory(): Promise<any> {
    const rows = [];

    const data = await this.createBillsRows();

    data.forEach((doc: { [s: string]: any } | ArrayLike<unknown>) => {
      rows.push(Object.values(doc));
    });

    const book = new Workbook();
    let sheet = book.addWorksheet('boletos');

    const firstColumn = styleSheets.firstColumn();
    rows.unshift(Object.keys(firstColumn));

    sheet.addRows(rows);
    sheet = styleSheets.styled(sheet);

    const File = await new Promise((resolve, reject) => {
      tmp.file(
        {
          discardDescriptor: true,
          prefix: 'relatorio',
          postfix: '.xlsx',
          mode: parseInt('0600', 8),
        },
        async (err, file) => {
          if (err) {
            throw new BadRequestException(err);
            reject(err);
          }
          book.xlsx
            .writeFile(file)
            .then(() => {
              resolve(file);
            })
            .catch((err) => {
              throw new BadRequestException(err);
              reject(err);
            });
        },
      );
    });
    return File;
  }

  async createBillsRows(): Promise<BillRownDto[]> {
    const bills = await this.billsService.find();
    return Promise.all(
      bills.map(
        (bill) =>
          new BillRownDto(
            bill.id,
            bill.nameDrawn,
            bill.lot.id,
            bill.value,
            bill.digitableLine,
          ),
      ),
    );
  }

  async createRelatory(relatory: number) {
    if (relatory === 1) {
      const pdf = await this.createPDFRelatory();
      return pdf;
    } else if (relatory === 2) {
      const xls = await this.createXLSXRelatory();
      return xls;
    }
  }

  async createPDFRelatory() {
    const data = await this.createBillsRows();

    return new Promise((resolve, reject) => {
      const pdfDoc = new pdfkit();
      const buffers = [];

      const createTableHeader = () => {
        pdfDoc
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('id', 40, 50)
          .text('|', 70, 50)
          .text('nome_sacado', 80, 50)
          .text('|', 230, 50)
          .text('id_lote', 250, 50)
          .text('|', 300, 50)
          .text('valor', 320, 50)
          .text('|', 370, 50)
          .text('linha_digitavel', 380, 50);
      };

      const fillTableData = (data) => {
        let y = 80;
        const itemsPerPage = 30;
        let currentPage = 1;
        data.forEach((item, index) => {
          if (index > 0 && index % itemsPerPage === 0) {
            pdfDoc.addPage();
            createTableHeader();
            y = 80;
            currentPage++;
          }
          pdfDoc
            .fontSize(12)
            .font('Helvetica')
            .text(item.id.toString(), 40, y)
            .text('|', 70, y)
            .text(item.nome_sacado, 80, y)
            .text('|', 230, y)
            .text(item.id_lote.toString(), 250, y)
            .text('|', 300, y)
            .text(item.valor.toString(), 320, y)
            .text('|', 370, y)
            .text(item.linha_digitavel, 380, y);

          y += 20;
        });
      };

      createTableHeader();
      fillTableData(data);

      pdfDoc.on('data', (buffer) => buffers.push(buffer));
      pdfDoc.on('end', () => resolve(Buffer.concat(buffers)));

      pdfDoc.end();
    });
  }
}
