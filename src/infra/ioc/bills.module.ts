import { Module, forwardRef } from '@nestjs/common';
import { BillsService } from '../../aplication/services/bills.service';
import { BillsController } from '../../presentation/controllers/bills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from '../../domain/models/bill.entity';
import { LotsModule } from './lots.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bill]), forwardRef(() => LotsModule)],
  providers: [BillsService],
  controllers: [BillsController],
  exports: [BillsService],
})
export class BillsModule {}
