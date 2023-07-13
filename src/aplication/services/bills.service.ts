import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Bill } from '../../domain/models/bill.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBillDto } from '../../presentation/dtos/bills/create-bill.dto';
import { LotsService } from './lots.service';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private billsRepository: Repository<Bill>,
    @Inject(forwardRef(() => LotsService))
    private readonly lotsService: LotsService,
  ) {}

  async create(data: CreateBillDto): Promise<Bill> {
    const lot = await this.lotsService.findById(data.lotId);
    const bill = this.billsRepository.create({
      nameDrawn: data.nameDrawn,
      digitableLine: data.digitableLine,
      value: data.value,
      lot,
    });
    const billSaved = await this.billsRepository.save(bill);

    if (!billSaved) {
      throw new InternalServerErrorException(
        'Problema ao criar boleto. Tente Novamente',
      );
    }

    return billSaved;
  }

  async findById(id: string): Promise<Bill> {
    const bill = await this.billsRepository.findOne({ where: { id } });
    if (!bill) {
      throw new NotFoundException('Nenhum Boleto encontrado');
    }
    return bill;
  }
}
