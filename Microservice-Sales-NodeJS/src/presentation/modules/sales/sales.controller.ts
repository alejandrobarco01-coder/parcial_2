import { Request, Response } from 'express';
import { HandleError } from '../../../domain/erros/handle.error';
import { CustomError } from '../../../domain/erros/custom.error';
import { SalesService } from './sales.service';

export class SalesController {
  private readonly salesService = new SalesService();

  getAllSales = (req: Request, res: Response): void => {
    const limit = Number(req.query.limit ?? 10);
    this.salesService.getAllSales(limit)
      .then((sales) => res.status(200).json(sales))
      .catch((error) => HandleError.error(CustomError.badRequest(error instanceof Error ? error.message : 'Solicitud inválida'), res));
  };

  getSaleById = (req: Request, res: Response): void => {
    this.salesService.getSaleById(Number(req.params.id))
      .then((sale) => sale ? res.json(sale) : HandleError.error(CustomError.notFound('Venta no encontrada'), res))
      .catch((error) => HandleError.error(error, res));
  };

  createSale = (req: Request, res: Response): void => {
    this.salesService.createSale(req.body)
      .then((sale) => res.status(201).json(sale))
      .catch((error) => HandleError.error(CustomError.badRequest(error instanceof Error ? error.message : 'Venta inválida'), res));
  };
}
