import { Router } from 'express';
import { SalesRoutes } from './modules/sales/sales.routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    router.use('/api/sales', SalesRoutes.routes);
    return router;
  }
}