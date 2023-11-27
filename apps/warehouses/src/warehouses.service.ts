import { Injectable } from '@nestjs/common';

@Injectable()
export class WarehousesService {
  getHello(): string {
    return 'warehouses running...';
  }
}
