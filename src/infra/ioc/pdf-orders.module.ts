import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PDFOrdersService } from '../../aplication/services/pdf-orders.service';
import { PDFOrder } from '../../domain/models/pdf-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PDFOrder])],
  providers: [PDFOrdersService],
  exports: [PDFOrdersService],
})
export class PDFOrdersModule {}
