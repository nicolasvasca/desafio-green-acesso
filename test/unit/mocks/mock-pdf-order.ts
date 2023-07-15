import { PDFOrder } from '../../../src/domain/models/pdf-order.entity';

export default class MockPDFOrder {
  static mockPDFOrder(): PDFOrder {
    const pdfOrder = new PDFOrder();
    pdfOrder.name = 'JOSE';
    pdfOrder.id = '1';
    return pdfOrder;
  }
}
