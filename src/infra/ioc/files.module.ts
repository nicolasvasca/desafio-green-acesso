import { Module, forwardRef } from '@nestjs/common';
import { FilesService } from '../../aplication/services/files.service';
import { FilesController } from '../../presentation/controllers/files.controller';
import { BillsModule } from './bills.module';
import { LotsModule } from './lots.module';
import { PDFOrdersModule } from './pdf-orders.module';

@Module({
  imports: [
    forwardRef(() => LotsModule),
    forwardRef(() => BillsModule),
    forwardRef(() => PDFOrdersModule),
  ],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
