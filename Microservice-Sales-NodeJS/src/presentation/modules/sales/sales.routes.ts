import { Router } from 'express';
import { SalesController } from './sales.controller';

export class SalesRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new SalesController();

    router.get('/', controller.getAllSales);
    router.get('/:id', controller.getSaleById);
    router.post('/', controller.createSale);

    return router;
  }
}
