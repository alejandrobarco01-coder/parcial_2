import { Request, Response } from "express";
import { HandleError } from "../../../domain/erros/handle.error";
import { ListProductsUseCase } from '../../../application/use-cases/list-products.use-case';
import { GetProductByIdUseCase } from '../../../application/use-cases/get-product-by-id.use-case';
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case';
import { InMemoryProductsRepository } from '../../../infrastructure/repositories/in-memory-products.repository';
import { CreateProductInput } from '../../../domain/interfaces/product.interface';

/**
 * Controlador de productos.
 *
 * @remarks
 * Esta clase maneja las peticiones HTTP relacionadas con productos,
 * delegando la lógica de negocio a los casos de uso correspondientes.
 */
export class ProductsController {
  private readonly repository = new InMemoryProductsRepository();
  private readonly listProducts = new ListProductsUseCase(this.repository);
  private readonly getProductByIdUseCase = new GetProductByIdUseCase(this.repository);
  private readonly createProductUseCase = new CreateProductUseCase(this.repository);

  /**
   * Maneja la petición HTTP para obtener un listado de productos.
   *
   * @param req Objeto de petición de Express
   * @param res Objeto de respuesta de Express
   */
  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawLimit = req.query['limit'];
      const limit = rawLimit === undefined ? 10 : Number(rawLimit);
      const products = await this.listProducts.execute(limit);
      res.status(200).json(products);
    } catch (error) {
      HandleError.error(error, res);
    }
  };

  /**
   * Maneja la petición HTTP para consultar un producto por ID.
   *
   * @param req Objeto de petición de Express
   * @param res Objeto de respuesta de Express
   */
  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.getProductByIdUseCase.execute(Number(req.params['id']));
      res.status(200).json(product);
    } catch (error) {
      HandleError.error(error, res);
    }
  };

  /**
   * Maneja la petición HTTP para crear un nuevo producto.
   *
   * @param req Objeto de petición de Express
   * @param res Objeto de respuesta de Express
   */
  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.createProductUseCase.execute(req.body as CreateProductInput);
      res.status(201).json(product);
    } catch (error) {
      HandleError.error(error, res);
    }
  };
}
