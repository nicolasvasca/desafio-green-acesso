import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FilesService } from '../../src/aplication/services/files.service';
import { LotsService } from '../../src/aplication/services/lots.service';
import { BillsService } from '../../src/aplication/services/bills.service';
import MockRepository from './mocks/mock-repository';
import { PDFOrdersService } from '../../src/aplication/services/pdf-orders.service';
import { Bill } from '../../src/domain/models/bill.entity';
import { PDFOrder } from '../../src/domain/models/pdf-order.entity';
import { Lot } from '../../src/domain/models/lot.entity';

describe('FilesService', () => {
  let service: FilesService;
  const mockRepository = MockRepository.mockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        BillsService,
        LotsService,
        PDFOrdersService,
        {
          provide: getRepositoryToken(Bill),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Lot),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(PDFOrder),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
