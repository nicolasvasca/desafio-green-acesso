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
import { FilterBillDto } from '../../presentation/dtos/bills/filter-bill.dto';

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

  async find(filter?: FilterBillDto): Promise<Bill[]> {
    let query = this.billsRepository
      .createQueryBuilder('bill')
      .leftJoinAndSelect('bill.lot', 'lot');
    let first = true;
    if (filter?.name) {
      const nameWithoutSpaces = filter.name.replace(/\s/g, '');
      query = query.where('bill.nameDrawn ILIKE :name', {
        name: `%${nameWithoutSpaces}%`,
      });
      first = false;
    }

    if (filter?.valueMin && filter?.valueMax) {
      query = first
        ? query.where('bill.value BETWEEN :min AND :max', {
            min: filter.valueMin,
            max: filter.valueMax,
          })
        : query.andWhere('bill.value BETWEEN :min AND :max', {
            min: filter.valueMin,
            max: filter.valueMax,
          });
    } else if (filter?.valueMin) {
      query = first
        ? query.where('bill.value >= :min', { min: filter.valueMin })
        : query.andWhere('bill.value >= :min', { min: filter.valueMin });
    } else if (filter?.valueMax) {
      query = first
        ? query.where('bill.value <= :max', { max: filter.valueMax })
        : query.andWhere('bill.value <= :max', { max: filter.valueMax });
    }

    if (filter?.lotId) {
      query = first
        ? query.where('bill.lotId = :lotId', { lotId: filter.lotId })
        : query.andWhere('bill.lotId = :lotId', { lotId: filter.lotId });
    }

    const bills = await query.getMany();
    return bills;
  }

  // async find(filter?: FilterBillDto): Promise<Bill[]> {
  //   let query = {};
  //   if (filter?.name) {
  //     const nameWithoutSpaces = filter.name.replace(/\s/g, '').toUpperCase();
  //     query = {
  //       ...query,
  //       nameDrawn: ILike(`%${nameWithoutSpaces}%`),
  //     };
  //   }
  //   if (filter?.valueMin) {
  //     query = {
  //       ...query,
  //       value: MoreThan(filter.valueMin),
  //     };
  //   }
  //   if (filter?.valueMax) {
  //     query = {
  //       ...query,
  //       value: filter?.valueMin
  //         ? Between(filter.valueMin, filter.valueMax)
  //         : LessThan(filter.valueMax),
  //     };
  //   }
  //   if (filter?.lotId) {
  //     console.log(filter?.lotId);
  //     query = {
  //       ...query,
  //       lotId: filter.lotId,
  //     };
  //   }
  //   const bills = await this.billsRepository.find({
  //     where: query,
  //     relations: { lot: true },
  //   });
  //   return bills;
  // }

  async findOne(nameDrawn: string, hasPDF: boolean): Promise<Bill> {
    const bill = await this.billsRepository.findOne({
      where: {
        nameDrawn: nameDrawn,
        hasPDF: hasPDF,
      },
    });
    if (!bill) {
      throw new NotFoundException('Nenhum Boleto encontrado');
    }
    return bill;
  }

  async updateHasPDF(id: string): Promise<Bill> {
    const bill = await this.findById(id);

    bill.hasPDF = true;

    const billUpdated = await this.billsRepository.save(bill);

    return billUpdated;
  }

  async updateBillsHasPdf(ids: string[]): Promise<Bill[]> {
    return Promise.all(
      ids.map((id) => {
        return this.updateHasPDF(id);
      }),
    );
  }
}
