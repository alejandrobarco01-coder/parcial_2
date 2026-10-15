import { Request, Response } from 'express';
import { HandleError } from '../../../domain/erros/handle.error';
import { ListSalesUseCase } from '../../../application/use-cases/list-sales.use-case';
import { GetSaleByIdUseCase } from '../../../application/use-cases/get-sale-by-id.use-case';
import { CreateSaleUseCase } from '../../../application/use-cases/create-sale.use-case';
import { InMemorySalesRepository } from '../../../infrastructure/repositories/in-memory-sales.repository';
import { CreateSaleInput } from '../../../domain/interfaces/sale.interface';

/**
 * Controlador de ventas.
 *
 * @remarks
 * Esta clase maneja las peticiones HTTP relacionadas con ventas,
 * delegando la lógica de negocio a los casos de uso correspondientes.
 */
export class SalesController {
  private readonly repository = new InMemorySalesRepository();
  private readonly listSales = new ListSalesUseCase(this.repository);
  private readonly getSaleByIdUseCase = new GetSaleByIdUseCase(this.repository);
  private readonly createSaleUseCase = new CreateSaleUseCase(this.repository);

  /**
   * Maneja la petición HTTP para obtener un listado de ventas.
   *
   * @param req Objeto de petición de Express
   * @param res Objeto de respuesta de Express
   */
  getAllSales = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawLimit = req.query['limit'];
      const limit = rawLimit === undefined ? 10 : Number(rawLimit);
      const sales = await this.listSales.execute(limit);
      res.status(200).json(sales);
    } catch (error) {
      HandleError.error(error, res);
    }
  };

  /**
   * Maneja la petición HTTP para consultar una venta por ID.
   *
   * @param req Objeto de petición de Express
   * @param res Objeto de respuesta de Express
   */
  getSaleById = async (req: Request, res: Response): Promise<void> => {
    try {
      const sale = await this.getSaleByIdUseCase.execute(Number(req.params['id']));
      res.status(200).json(sale);
    } catch (error) {
      HandleError.error(error, res);
    }
  };

  /**
   * Maneja la petición HTTP para registrar una nueva venta.
   *
   * @param req Objeto de petición de Express
   * @param res Objeto de respuesta de Express
   */
  createSale = async (req: Request, res: Response): Promise<void> => {
    try {
      const sale = await this.createSaleUseCase.execute(req.body as CreateSaleInput);
      res.status(201).json(sale);
    } catch (error) {
      HandleError.error(error, res);
    }
  };
}
