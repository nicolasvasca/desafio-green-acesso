import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PDFOrder } from '../../domain/models/pdf-order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PDFOrdersService {
  constructor(
    @InjectRepository(PDFOrder)
    private pdfOrdersRepository: Repository<PDFOrder>,
  ) {}

  async create(name: string): Promise<PDFOrder> {
    const pdfOrder = this.pdfOrdersRepository.create({ name });
    const pdfOrderSaved = await this.pdfOrdersRepository.save(pdfOrder);

    if (!pdfOrderSaved) {
      throw new InternalServerErrorException(
        'Problema ao criar lote. Tente Novamente',
      );
    }

    return pdfOrderSaved;
  }

  async find(): Promise<PDFOrder[]> {
    const pdfOrders = await this.pdfOrdersRepository.find();
    return pdfOrders;
  }
}
