import { Test, TestingModule } from '@nestjs/testing';
import { LotsService } from '../../src/aplication/services/lots.service';
import MockRepository from './mocks/mock-repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Lot } from '../../src/domain/models/lot.entity';
import MockLot from './mocks/mock-lot';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('LotsService', () => {
  let service: LotsService;
  let mockRepository = MockRepository.mockRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LotsService,
        {
          provide: getRepositoryToken(Lot),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LotsService>(LotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(() => {
    mockRepository = MockRepository.resetMocks(mockRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When search Lot By Id', () => {
    it('should find a existing lot', async () => {
      const lot = MockLot.mockLot();
      mockRepository.findOne.mockReturnValue(lot);
      const lotFound = await service.findById('1');
      expect(lotFound).toMatchObject({ name: lot.name });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return a exception when does not to find a lot', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findById('3')).rejects.toBeInstanceOf(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search Lot By Name', () => {
    it('should find a existing lot', async () => {
      const lot = MockLot.mockLot();
      mockRepository.findOne.mockReturnValue(lot);
      const lotFound = await service.findByName('1');
      expect(lotFound).toMatchObject({ name: lot.name });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create lot', () => {
    it('should create a lot', async () => {
      const lot = MockLot.mockLot();
      mockRepository.save.mockReturnValue(lot);
      mockRepository.create.mockReturnValue(lot);
      const savedLot = await service.create(lot);

      expect(savedLot).toMatchObject(lot);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
    it('should return a exception when doesnt create a lot', async () => {
      const lot = MockLot.mockLot();
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(lot);

      await service.create(lot).catch((e) => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Problema ao criar lote. Tente Novamente',
        });
      });
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });
});
