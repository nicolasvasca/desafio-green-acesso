import { Module } from '@nestjs/common';
import { LotsService } from '../../aplication/services/lots.service';
import { Lot } from '../../domain/models/lot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Lot])],
  providers: [LotsService],
  exports: [LotsService],
})
export class LotsModule {}
