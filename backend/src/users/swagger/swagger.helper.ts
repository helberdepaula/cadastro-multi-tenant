import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { userQueryParams } from "./stock.swagger.config";

export function stockExample() {
  return {
    productId: 'a1b2c3d4-uuid-product',
    invoiceNumber: 'NF12345',
    supplierId: 's1u2p3l4-uuid-supplier',
    cost: 12.5,
    quantity: 10,
    expiryDate: '2026-12-31T00:00:00.000Z',
    lotNumber: 'Lote-001',
  };
}

export function UserQuerySwagger() {
  return applyDecorators(
    ...userQueryParams.map(param => ApiQuery(param))
  );
}


