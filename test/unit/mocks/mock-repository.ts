export default class MockRepository {
  static mockRepository() {
    return {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
      leftJoinAndSelect: jest.fn(),
      getMany: jest.fn(),
    };
  }
  static resetMocks(mockRepository) {
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.update.mockReset();
    mockRepository.delete.mockReset();
    mockRepository.createQueryBuilder.mockReset();
    mockRepository.leftJoinAndSelect.mockReset();
    mockRepository.getMany.mockReset();
    return mockRepository;
  }
}
