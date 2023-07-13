import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Lot } from '../../domain/models/lot.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLotDto } from '../../presentation/dtos/lots/create-lot.dto';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private lotsRepository: Repository<Lot>,
  ) {}

  async create(data: CreateLotDto): Promise<Lot> {
    const lot = this.lotsRepository.create(data);
    const lotSaved = await this.lotsRepository.save(lot);

    if (!lotSaved) {
      throw new InternalServerErrorException(
        'Problema ao criar lote. Tente Novamente',
      );
    }

    return lotSaved;
  }

  async findByName(name: string): Promise<Lot> {
    const lot = await this.lotsRepository.findOne({ where: { name } });
    return lot;
  }

  async findById(id: string): Promise<Lot> {
    const lot = await this.lotsRepository.findOne({ where: { id } });
    if (!lot) {
      throw new NotFoundException('Nenhum Lote encontrado');
    }
    return lot;
  }
}
