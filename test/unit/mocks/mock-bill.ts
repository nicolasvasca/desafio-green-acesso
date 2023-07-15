import { CreateBillDto } from '../../../src/presentation/dtos/bills/create-bill.dto';
import { Bill } from '../../../src/domain/models/bill.entity';
import MockLot from './mock-lot';

export default class MockBill {
  static mockBill(): Bill {
    const bill = new Bill();
    bill.lot = MockLot.mockLot();
    bill.id = '1';
    bill.nameDrawn = 'JOSE';
    bill.value = 188;
    bill.hasPDF = false;
    bill.digitableLine = '12243343';
    bill.createdAt = new Date();
    bill.active = true;
    return bill;
  }
  static mockCreateBillDto(): CreateBillDto {
    const dto = new CreateBillDto();
    return dto;
  }
}
