import { Test, TestingModule } from '@nestjs/testing';
import { PDFOrdersService } from '../../src/aplication/services/pdf-orders.service';

describe('PDFOrdersService', () => {
  let service: PDFOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PDFOrdersService],
    }).compile();

    service = module.get<PDFOrdersService>(PDFOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
