import { Lot } from '../../../src/domain/models/lot.entity';

export default class MockLot {
  static mockLot(): Lot {
    const lot = new Lot();
    lot.name = '18';
    lot.id = '1';
    lot.createdAt = new Date();
    lot.active = true;
    return lot;
  }
}
