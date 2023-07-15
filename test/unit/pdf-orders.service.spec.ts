import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PDFOrdersService } from '../../src/aplication/services/pdf-orders.service';
import { PDFOrder } from '../../src/domain/models/pdf-order.entity';
import MockRepository from './mocks/mock-repository';
import MockPDFOrder from './mocks/mock-pdf-order';
import { InternalServerErrorException } from '@nestjs/common';

describe('PDFOrdersService', () => {
  let service: PDFOrdersService;
  let mockRepository = MockRepository.mockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PDFOrdersService,
        {
          provide: getRepositoryToken(PDFOrder),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PDFOrdersService>(PDFOrdersService);
  });

  beforeEach(() => {
    mockRepository = MockRepository.resetMocks(mockRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When search All PDFOrders', () => {
    it('should be list all pdfOrders', async () => {
      const pdfOrder = MockPDFOrder.mockPDFOrder();
      mockRepository.find.mockReturnValue([pdfOrder, pdfOrder]);
      const pdfOrders = await service.find();
      expect(pdfOrders).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create pdfOrder', () => {
    it('should create a lot', async () => {
      const pdfOrder = MockPDFOrder.mockPDFOrder();
      mockRepository.save.mockReturnValue(pdfOrder);
      mockRepository.create.mockReturnValue(pdfOrder);
      const savedPDFOrder = await service.create(pdfOrder.name);

      expect(savedPDFOrder).toMatchObject(pdfOrder);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
    it('should return a exception when doesnt create a lot', async () => {
      const pdfOrder = MockPDFOrder.mockPDFOrder();
      mockRepository.save.mockReturnValue(pdfOrder);
      mockRepository.create.mockReturnValue(pdfOrder);

      await service.create(pdfOrder.name).catch((e) => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Problema ao criar ordem do pdf. Tente Novamente',
        });
      });
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });
});
