import { Test, TestingModule } from '@nestjs/testing';
import { BillsService } from '../../src/aplication/services/bills.service';
import MockRepository from './mocks/mock-repository';
import { LotsService } from '../../src/aplication/services/lots.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bill } from '../../src/domain/models/bill.entity';
import { Lot } from '../../src/domain/models/lot.entity';
import MockBill from './mocks/mock-bill';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('BillsService', () => {
  let service: BillsService;
  let mockRepository = MockRepository.mockRepository();
  let mockLotRepository = MockRepository.mockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillsService,
        LotsService,
        {
          provide: getRepositoryToken(Bill),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Lot),
          useValue: mockLotRepository,
        },
      ],
    }).compile();

    service = module.get<BillsService>(BillsService);
  });

  beforeEach(() => {
    mockRepository = MockRepository.resetMocks(mockRepository);
    mockLotRepository = MockRepository.resetMocks(mockLotRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When search All Bills', () => {
    it('should be list all bills', async () => {
      const bill = MockBill.mockBill();
      mockRepository.createQueryBuilder.mockReturnThis();
      mockRepository.leftJoinAndSelect.mockReturnThis();
      mockRepository.getMany.mockReturnValue([bill, bill]);
      const bills = await service.find();
      expect(bills).toHaveLength(2);
      expect(mockRepository.getMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search Bill By Id', () => {
    it('should find a existing bill', async () => {
      const bill = MockBill.mockBill();
      mockRepository.findOne.mockReturnValue(bill);
      const billFound = await service.findById('1');
      expect(billFound).toMatchObject({ nameDrawn: bill.nameDrawn });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a bill', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findById('3')).rejects.toBeInstanceOf(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search one Bill', () => {
    it('should find a existing bill', async () => {
      const bill = MockBill.mockBill();
      mockRepository.findOne.mockReturnValue(bill);
      const billFound = await service.findOne('JOSE', false);
      expect(billFound).toMatchObject({ nameDrawn: bill.nameDrawn });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a bill', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findById('3')).rejects.toBeInstanceOf(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create lot', () => {
    it('should create a lot', async () => {
      const bill = MockBill.mockBill();
      const dto = MockBill.mockCreateBillDto();
      mockLotRepository.findOne.mockReturnValue(bill.lot);
      mockRepository.save.mockReturnValue(bill);
      mockRepository.create.mockReturnValue(bill);
      const savedBill = await service.create(dto);

      expect(savedBill).toMatchObject(bill);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
    it('should return a exception when doesnt create a lot', async () => {
      const bill = MockBill.mockBill();
      const dto = MockBill.mockCreateBillDto();
      mockLotRepository.findOne.mockReturnValue(bill.lot);
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(bill);

      await service.create(dto).catch((e) => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Problema ao criar boleto. Tente Novamente',
        });
      });
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
    it('should return a exception when doesnt find a lot', async () => {
      const bill = MockBill.mockBill();
      const dto = MockBill.mockCreateBillDto();
      mockLotRepository.findOne.mockReturnValue(null);
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(bill);

      await service.create(dto).catch((e) => {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e).toMatchObject({
          message: 'Nenhum Lote encontrado',
        });
      });
      expect(mockLotRepository.findOne).toBeCalledTimes(1);
    });
  });

  describe('When update hasPDF Bill', () => {
    it('Should update a hasPDF', async () => {
      const bill = MockBill.mockBill();
      mockRepository.findOne.mockReturnValue(bill);
      mockRepository.save.mockReturnValue({
        ...bill,
        hasPDF: true,
      });

      const resultPlanet = await service.updateHasPDF('1');

      expect(resultPlanet).toMatchObject({ hasPDF: true });
      expect(mockRepository.save).toBeCalledTimes(1);
      expect(mockRepository.findOne).toBeCalledTimes(1);
    });
  });

  describe('When update any bills hasPDF Planet', () => {
    it('Should update a hasPDF', async () => {
      const bill = MockBill.mockBill();
      mockRepository.findOne.mockReturnValue(bill);
      mockRepository.save.mockReturnValue({
        ...bill,
        hasPDF: true,
      });

      const resultBills = await service.updateBillsHasPdf(['1', '2']);

      expect(resultBills).toHaveLength(2);
      expect(mockRepository.save).toBeCalledTimes(2);
      expect(mockRepository.findOne).toBeCalledTimes(2);
    });
  });
});
